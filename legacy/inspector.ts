import { Connection, PublicKey, RpcResponseAndContext, AccountInfo } from "@solana/web3.js";
import { Constant, Util } from './util';

const web3 = require('@solana/web3.js');

interface InspectorConfig {
  clusterURL?: string|null,
  tokenMintAddress: string|PublicKey,
  targets?: Set<Wallet>
}

interface Wallet {
  name: string,
  str_publicKey: string,
  publicKey?: PublicKey,
  str_associatedPublicKey?: string,
  associatedPublicKey?: PublicKey
}

class Inspector {
  connection:Connection;
  tokenMintAddress:PublicKey;
  target:Set<Wallet>|undefined;

  constructor({ 
    clusterURL = Constant.clusterURL,
    tokenMintAddress,
    targets = new Set<Wallet>()
  } : InspectorConfig) {
    this.connection = new web3.Connection(clusterURL);

    if (typeof tokenMintAddress === 'string') {
      this.tokenMintAddress = new PublicKey(tokenMintAddress);
    } else {
      this.tokenMintAddress = tokenMintAddress;
    }
    
    this.target = targets;
  }

  getPublicKey(str_publicKey:string) {
    return new PublicKey(str_publicKey);
  }

  async getAssociatedAddress(publicKey: PublicKey): Promise<RpcResponseAndContext<Array<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
  }>>> {
    return await this.connection.getTokenAccountsByOwner(
      publicKey, {
        mint: this.tokenMintAddress
      }
    );
  }

  async addWallet({
    name, str_publicKey, publicKey, str_associatedPublicKey, associatedPublicKey
  }) {    if (!publicKey && !str_publicKey) {
      throw new Error(Constant.Errors.NO_PUBLICKEY_PARAMETER_ERROR);
    }
    if (!publicKey) {
      publicKey = this.getPublicKey(str_publicKey);
    }

    console.log(await this.getAssociatedAddress(publicKey));
  }
}

export { Inspector };

// interface Wallet {
//   title:string,
//   publicKey: string,
//   associatedAddress: string
// }

// interface signatureQuery {
//   limit: number,
//   before: string,
//   until: string,
//   commitment: string
// }

// interface signature {
//   blockTime: number,
//   confirmationStatus: string,
//   err: string|null,
//   memo: string|null,
//   signature: string,
//   slot: number
// }

// interface searchedSignatureTable extends Wallet {
//   signatures: Array<signature>
// }

// interface parsedSignature {
//   source: string,
//   destination: string,
//   uiAmount: string,
//   signature: string
// }

// interface parsedSignatureTable extends searchedSignatureTable {
//   parsedSignatures: Array<parsedSignature>
// }

// class CONSTANT {
//   static CLUSTER_URL: string = 'https://api.mainnet-beta.solana.com';
// }

// class Inspector {
//   connection:Connection; // web3 connection
//   tokenMintAddress:string;
//   tokenMintPublicKey:any; // public Key
//   searchTable:Set<Wallet>;
//   fetchLimit:number;
//   fetchDelay:number;

//   constructor(
//     cluster_url:string = CONSTANT.CLUSTER_URL, 
//     tokenMintAddress:string
//   ) {
    // this.connection = new web3.Connection(cluster_url);
    // this.tokenMintAddress = tokenMintAddress;
    // this.tokenMintPublicKey = new web3.PublicKey(this.tokenMintAddress);
    // this.searchTable = new Set<Wallet>();
    // this.fetchLimit = 1000;
    // this.fetchDelay = 2000;
//   }

//   async getAssociatedAddress(publicKey:string) : Promise<string> {
//     return await this.connection.getTokenAccountsByOwner(
//       new web3.PublicKey(publicKey), {
//         mint: this.tokenMintPublicKey
//       }
//     );
//   }

//   async getstringOfAssociatedAddress(publicKey:string) : Promise<string> {
//     const associatedAddress:any = await this.getAssociatedAddress(publicKey);
    
//     return associatedAddress.value[0].pubkey.toString();
//   }

//   getWallet(title:string, publicKey:string, associatedAddress:string): Wallet {
//     const wallet:Wallet = {
//       title, publicKey, associatedAddress
//     }
//     return wallet
//   }

  // async pushSearchTable(title:string, publicKey:string, associatedAddress:string = '') {
  //   associatedAddress = associatedAddress ? associatedAddress : await this.getstringOfAssociatedAddress(publicKey);

  //   const n_wallet:Wallet = this.getWallet(title, publicKey, associatedAddress);
    
  //   this.searchTable.add(n_wallet);
  // }

//   getPublicKey(publicKey:string): PublicKey {
//     return new PublicKey(publicKey);
//   }

  // async getSignatures(pubKey:PublicKey, limit:number = 1000, before:string ='', until:string|undefined='', commitment:string='finalized'): Promise<Array<signature>> {
  //   var query:signatureQuery = <signatureQuery>{};

  //   if (limit) { query.limit = limit; }
  //   if (before) { query.before = before; }
  //   if (until) { query.until = until; }
  //   if (commitment) { query.commitment = commitment; }
    
  //   const signatures = await this.connection.getConfirmedSignaturesForAddress2(pubKey, query);

  //   return signatures;
  // }

//   async getAllSignatures():Promise<Array<searchedSignatureTable>> {
//     const result:Array<searchedSignatureTable> = [];
    
//     for (var wallet of Array.from(this.searchTable.values())) {
//       const searchedSignatureTable:searchedSignatureTable = <searchedSignatureTable>wallet;
//       searchedSignatureTable.signatures = [];

//       const pubKey:PublicKey = this.getPublicKey(searchedSignatureTable.associatedAddress);
//       var temp_res:Array<string> = [];

//       do {
//         const res:Array<signature> = await this.getSignatures(
//           pubKey,
//           this.fetchLimit,
//           temp_res ? temp_res[temp_res.length - 1] : ''
//         )
  
//         const signatures = res.map((ele) => ele.signature);
//         temp_res = signatures;
  
//         searchedSignatureTable.signatures.push(...res);
        
//         await Util.sleep(this.fetchDelay);
//       } while (temp_res.length);
//       result.push(searchedSignatureTable);
//     }
    
//     return result;
//   }

//   async parseSignature(signatures: string):Promise<parsedSignature> {
//     const parsed = this.connection.getParsed


//     return [];
//   }

//   async parseSignatures(signatures: Array<string>):Promise<Array<parsedSignatureTable>> {
//     const unique_signatures = new Set(...signatures);
    
    
//     // searchedSignatures.map((searchedSignature) => {
//     //   searchedSignature.signatures.map((signature) => {
//     //     unique_signatures.add(signature);
//     //   })
//     // })
    

//     // console.log(unique_signatures);
    
//     return [];
//   }

//   async getAllSignaturesFromPublicKey(publicKey:string):Promise<Array<signature>> {
//     const pubKey = this.getPublicKey(publicKey);
//     const result = <Array<signature>>[];
//     var temp_res = <any>[];

//     do {
//       const res:Array<signature> = await this.getSignatures(
//         pubKey,
//         this.fetchLimit,
//         temp_res ? temp_res[temp_res.length - 1] : ''
//       )

//       const signatures = res.map((ele) => ele.signature);
//       temp_res = signatures;

//       result.push(...res);
      
//       await Util.sleep(this.fetchDelay);
//     } while (temp_res.length);
    
//     return result;
//   }

//   async getAllSignaturesFromName(publicKeyName:string):Promise<Array<signature>> {
//     var targetWallet:Wallet = <Wallet>{};

//     for (var wallet of Array.from(this.searchTable.values())) {
//       if (wallet.title === publicKeyName) {
//         targetWallet = wallet;
//       }
//     }

//     const publicKey = targetWallet.publicKey;

//     const res = await this.getAllSignaturesFromPublicKey(publicKey);

//     return res;
//   }
// }

// export { Inspector };

// export {
//   Wallet, signature, signatureQuery, searchedSignatureTable
// }