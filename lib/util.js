
class Constant {
  static clusterURL = 'https://api.mainnet-beta.solana.com';
  static Errors = {
    NO_PUBLICKEY_PARAMETER_ERROR: 'No publickey is entered!',
  }
}

class Util {
  static getUniqueArray(array, key) {
    return Array.from(new Map(array.map(item =>
      [item[key], item])).values())
  }

  static sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

export { Constant, Util };
