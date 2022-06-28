import { Connection, PublicKey } from "@solana/web3.js";
import { Constant, Util } from './util.js';

class Inspector {
  constructor({
    clusterURL = Constant.clusterURL,
    tokenMintAddress,
    wallets = new Map()
  }) {
    this.connection = new Connection(clusterURL);

    if (typeof tokenMintAddress === 'string') {
      this.tokenMintAddress = new PublicKey(tokenMintAddress);
    } else {
      this.tokenMintAddress = tokenMintAddress;
    }

    this.wallets = wallets;
  }

  getPublicKey(str_publicKey) {
    return new PublicKey(str_publicKey);
  }

  async getAssociatedPublicKey(publicKey) {
    const res = await this.connection.getTokenAccountsByOwner(
      publicKey, {
      mint: this.tokenMintAddress
    })

    return res.value[0].pubkey
  }

  async addWallet({
    name, str_publicKey, publicKey, str_associatedPublicKey, associatedPublicKey
  }) {
    if (!publicKey && !str_publicKey) {
      throw new Error(Constant.Errors.NO_PUBLICKEY_PARAMETER_ERROR);
    }
    if (!publicKey) {
      publicKey = this.getPublicKey(str_publicKey);
    }

    associatedPublicKey = await this.getAssociatedPublicKey(publicKey);
    str_associatedPublicKey = associatedPublicKey.toString();
    
    this.wallets.set(name, {
      str_publicKey,
      publicKey,
      str_associatedPublicKey,
      associatedPublicKey
    })

    return true;
  }

  deleteWallet({ name }) {
    return this.wallets.delete(name);
  }

  async #getSignatures({ publicKey, limit = 1000, before  ='', until = '', commitment='finalized' }) {
    var query = {};

    if (limit) { query.limit = limit; }
    if (before) { query.before = before; }
    if (until) { query.until = until; }
    
    const signatures = await this.connection.getSignaturesForAddress(publicKey, query, commitment);

    return signatures;
  }

  async #getSignaturesOfPublicKey({ publicKey }) {
    var lastSig = '';
    const result = [];
    do {
      const res = await this.#getSignatures({ publicKey, before: lastSig })

      if (result.length && result[result.length - 1]) {
        lastSig = result[result.length - 1].signature;
      }

      result.push(...res);
    } while (lastSig);

    return result;
  }

  #cloneWallets() {
    const wallets = new Map(this.wallets)
    
    return wallets
  }

  async getAllSignaturesOfPublicKey({ publicKey }) {
    return await this.#getSignaturesOfPublicKey({ publicKey });
  }

  async getAllSignaturesOfWallet() {
    const wallets = this.#cloneWallets();

    for (const [name, wallet] of wallets.entries()) {
      const { publicKey } = wallet;

      wallets.set(name, {
        ...wallet,
        signatures: await this.getAllSignaturesOfPublicKey({ publicKey })
      })
    } 

    return wallets;
  }

  async #getParsedTransactionOfSignatures({ signatures = [], commitment = 'finalized', filter='spl-token' }) {
    const parsedTransactions = await this.connection.getParsedTransactions(signatures, commitment);
    // console.log(parsedTransactions[0].transaction.message)
    if (filter === 'spl-token') {
      parsedTransactions.forEach((parsedTransaction) => {
        const instructions = parsedTransaction?.transaction?.message?.instructions;
        console.log('instructions', instructions);
        if (instructions) {
          console.log('1', instructions);
          parsedTransaction.instructions = instructions;
        } else {
          console.log('2', new Array());
          parsedTransaction.instructions = new Array();
        }
        
      })

      for (const parsedTransaction of parsedTransactions) {
        const { instructions } = parsedTransaction;
        parsedTransaction.transferTransactions = [];

        for (const instruction of instructions) {
          if (instruction?.program === 'spl-token') {
            parsedTransaction.transferTransactions.push(instruction);
          }
        }
      }
    }

    return parsedTransactions;
  }

  async getParsedTransactionsOfWallet({ filter='spl-token' } = {}) {
    const allSignaturesOfWallet = await this.getAllSignaturesOfWallet();
    
    for (const [name, wallet] of allSignaturesOfWallet.entries()) {
      const signatures = wallet.signatures.map((ele) => ele.signature);
      allSignaturesOfWallet.set(name, {
        ...wallet,
        transaction: await this.#getParsedTransactionOfSignatures({ 
          signatures, filter
        })
      })
    }
    
    const result = allSignaturesOfWallet;

    return result;
  }
}

export { Inspector };
