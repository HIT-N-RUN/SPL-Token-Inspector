const web3 = require('@solana/web3.js');

interface Wallet {
  title:String,
  publicKey: String,
  associatedAddress: String
}

class CONSTANT {
  static CLUSTER_URL: string = 'https://api.mainnet-beta.solana.com';
}

class Inspector {
  connection:any; // web3 connection
  tokenMintAddress:string;
  tokenMintPublicKey:any; // public Key
  searchTable:Set<Wallet>;

  constructor(
    cluster_url:string = CONSTANT.CLUSTER_URL, 
    tokenMintAddress:string
  ) {
    this.connection = new web3.Connection(cluster_url);
    this.tokenMintAddress = tokenMintAddress;
    this.tokenMintPublicKey = new web3.PublicKey(this.tokenMintAddress);
    this.searchTable = new Set();
  }

  async pushSearchTable(title:string, publicKey:string, associatedAddress:string = '') {
    const n_wallet:Wallet = {
      title,
      publicKey,
      associatedAddress: associatedAddress ? 
        associatedAddress 
        : await this.connection.getTokenAccountsByOwner(
          new web3.PublicKey(publicKey, {
            mint: this.tokenMintPublicKey
          })
        )
    }
    console.log(n_wallet);
  }
}

export { Inspector };