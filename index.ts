/**
* @Method: Console log
* @Param: {string} title - Console group title
* @Param: {any} str - anything to log
* @Return: {boolean} - is success or not
*/
export function log(title: string, str: any): Boolean {
  console.group(title);

  console.log(str);
  
  console.groupEnd();

  return true;
}