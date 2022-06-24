import { PublicKey } from "@solana/web3.js";
import Excel from 'exceljs';

const web3 = require('@solana/web3.js');

interface Wallet {
  title:string,
  publicKey: string,
  associatedAddress: string
}

interface signatureQuery {
  limit: number,
  before: string,
  until: string,
  commitment: string
}

interface signature {
  blockTime: number,
  confirmationStatus: string,
  err: string|null,
  memo: string|null,
  signature: string,
  slot: number
}

interface searchedSignatureTable extends Wallet {
  signatures: Array<signature>
}

class CONSTANT {
  static CLUSTER_URL: string = 'https://api.mainnet-beta.solana.com';
}

class Util {
  static sleep(ms:number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

class Inspector {
  connection:any; // web3 connection
  tokenMintAddress:string;
  tokenMintPublicKey:any; // public Key
  searchTable:Set<Wallet>;
  fetchLimit:number;
  fetchDelay:number;

  constructor(
    cluster_url:string = CONSTANT.CLUSTER_URL, 
    tokenMintAddress:string
  ) {
    this.connection = new web3.Connection(cluster_url);
    this.tokenMintAddress = tokenMintAddress;
    this.tokenMintPublicKey = new web3.PublicKey(this.tokenMintAddress);
    this.searchTable = new Set<Wallet>();
    this.fetchLimit = 1000;
    this.fetchDelay = 2000;
  }

  async getAssociatedAddress(publicKey:string) : Promise<string> {
    return await this.connection.getTokenAccountsByOwner(
      new web3.PublicKey(publicKey), {
        mint: this.tokenMintPublicKey
      }
    );
  }

  async getstringOfAssociatedAddress(publicKey:string) : Promise<string> {
    const associatedAddress:any = await this.getAssociatedAddress(publicKey);
    
    return associatedAddress.value[0].pubkey.toString();
  }

  getWallet(title:string, publicKey:string, associatedAddress:string): Wallet {
    const wallet:Wallet = {
      title, publicKey, associatedAddress
    }
    return wallet
  }

  async pushSearchTable(title:string, publicKey:string, associatedAddress:string = '') {
    associatedAddress = associatedAddress ? associatedAddress : await this.getstringOfAssociatedAddress(publicKey);

    const n_wallet:Wallet = this.getWallet(title, publicKey, associatedAddress);
    
    this.searchTable.add(n_wallet);
  }

  getPublicKey(publicKey:string): PublicKey {
    return new PublicKey(publicKey);
  }

  async getSignatures(pubKey:PublicKey, limit:number = 1000, before:string ='', until:string|undefined='', commitment:string='finalized'): Promise<Array<signature>> {
    var query:signatureQuery = <signatureQuery>{};

    if (limit) { query.limit = limit; }
    if (before) { query.before = before; }
    if (until) { query.until = until; }
    if (commitment) { query.commitment = commitment; }
    
    const signatures = await this.connection.getConfirmedSignaturesForAddress2(pubKey, query);

    return signatures;
  }

  async getAllSignatures():Promise<Array<searchedSignatureTable>> {
    const result:Array<searchedSignatureTable> = [];
    
    for (var wallet of Array.from(this.searchTable.values())) {
      const searchedSignatureTable:searchedSignatureTable = <searchedSignatureTable>wallet;
      searchedSignatureTable.signatures = [];

      const pubKey:PublicKey = this.getPublicKey(searchedSignatureTable.associatedAddress);
      var temp_res:Array<string> = [];

      do {
        const res:Array<signature> = await this.getSignatures(
          pubKey,
          this.fetchLimit,
          temp_res ? temp_res[temp_res.length - 1] : ''
        )
  
        const signatures = res.map((ele) => ele.signature);
        temp_res = signatures;
  
        searchedSignatureTable.signatures.push(...res);
        
        await Util.sleep(this.fetchDelay);
      } while (temp_res.length);
      result.push(searchedSignatureTable);
    }
    
    return result;
  }

  async exportSearchedSignatureTable():Promise<boolean> {
    const workbook = new Excel.Workbook();
    const totalWorkSheet = workbook.addWorksheet('total');

    const countriesColumns = [
      { key: 'title', header: 'Title' },
      { key: 'publicKey', header: 'Public_key' },
      { key: 'associatedAddress', header: 'Associated_address' },
      { key: 'signature', header: 'signature' },
    ];

    totalWorkSheet.columns = countriesColumns
    
    // const worksheet = workbook.addWorksheet('Countries List');

    return true
  }
}

export { Inspector };