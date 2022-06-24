const web3 = require('@solana/web3.js');

interface Wallet {
  title:string,
  publicKey: string,
  associatedAddress: string
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

  
}

export { Inspector };