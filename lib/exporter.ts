import * as Excel from 'exceljs';

import { searchedSignatureTable, signature } from './inspector';
import { Util } from './util';

class Exporter {
  static async getTotalWorkSheet(workbook:any, data:Array<searchedSignatureTable>):Promise<boolean> {
    const worksheet = workbook.addWorksheet('total');
    const signatures:Array<signature> = [];

    data.forEach((rows) => {
      rows.signatures.forEach((signature => {
        signatures.push(signature);
      }));
    })

    const uniqueSignatures = Util.getUniqueArray(signatures, 'signature');

    worksheet.columns = [
      { header: 'blockTime', key: 'blockTime'},
      { header: 'confirmationStatus', key: 'confirmationStatus'},
      { header: 'err', key: 'err'},
      { header: 'memo', key: 'memo'},
      { header: 'signature', key: 'signature'},
      { header: 'slot', key: 'slot'},
    ]

    uniqueSignatures.map((item, index) => {
      worksheet.addRow(item);
    })
    
    return true;
  }

  static async write(workbook: any, fileName:string = 'test.xlsx') {
    await workbook.xlsx.writeFile(fileName);
  }

  static async exportSearchedSignatureTable(data:Array<searchedSignatureTable>):Promise<boolean> {
    const workbook = new Excel.Workbook();

    await this.getTotalWorkSheet(workbook, data);


    await this.write(workbook);

    return true
  }
}
 

export { Exporter };