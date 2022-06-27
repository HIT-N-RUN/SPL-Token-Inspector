
class Util {
  static getUniqueArray(array:Array<any>, key:string):Array<any> {
    return Array.from(new Map(array.map(item =>
      [item[key], item])).values())
  }

  static sleep(ms:number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

export { Util };
