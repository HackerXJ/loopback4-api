import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import mime from 'mime';
import moment from 'moment';
import {arrFilterKey} from './model';
/**
 * 常用的通用方法
 */
export class GeneralHandle {
  /**
   * 數據分組
   * @param array 带处理数据
   * @param fn    exp： function (item: { tag: any; }) {
                           return [item.tag];
                        }
   * @param tag : 分组字段
   * @returns
   */
  // public arrayGroupBy(array: Array<AnyObject>, fn: any) {
  //   let groups: AnyObject = {};
  //   array.forEach(function (item) {
  //     const group = JSON.stringify(fn(item));
  //     //这里利用对象的key值唯一性的,创建数组
  //     groups[group] = groups[group] || [];
  //     groups[group].push(item);
  //   });
  //   //最后再利用map循环处理分组出来
  //   return Object.keys(groups).map(function (group) {
  //     return groups[group];
  //   });
  // }

  /**
  * 对象排序
  * @param keyname 排序字段（数值类）
  * @param rule
  * @returns
  */
  public arraySortByKey = function a(keyname: string, rule: string) {
    return function (objectN: AnyObject, objectM: AnyObject): number {
      const valueN: number = objectN[keyname];
      const valueM: number = objectM[keyname];
      let order = valueN - valueM;
      if (rule.toLocaleUpperCase() === 'DESC') {
        order = valueM - valueN;
      }
      return order;
    };
  }

  /**
   *获取+08：00时间
   * @returns
   */
  static utcOffsetFormat() {
    const offset = moment().utcOffset();
    const hour: number = Number.parseInt((offset / 60).toFixed(0));
    const minutes = offset - hour * 60;
    const offsetString =
      '+' + moment({hour: hour, minute: minutes, second: 0}).format('HH:mm');
    return offsetString;
  }

  /**
   * 将字符串转换成驼峰写法
   * @param str
   * @returns
   */
  static toHump(str: string) {
    const strArr = str.split('_');
    for (let i = 1; i < strArr.length; i++) {
      strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
    }
    return strArr.join('');
  }

  /**
   * 數組分頁
   * @param data
   * @param pageNum
   * @param pageSize
   * @returns
   */
  static arrayPage(data: AnyObject, pageNum: number, pageSize: number) {
    let index = 0;
    const newArray: AnyObject = [];
    if (data.length) {
      while (index < data.length) {
        newArray.push(data.slice(index, index + pageSize));
        index = index + pageSize;
      }
      return newArray[pageNum - 1];
    }
    return newArray;
  }

  /**
   * 去掉字符串兩側空格和換行符
   * @param str
   * @returns
   */
  static removeSpaceAndNewline(str: string) {
    str = str.replace(/^\s+|\s+$/g, '').replace(/[\r\n]/g, '');
    return str;
  }

  /**
   * 字符串-繁體轉簡體
   * @param str
   * @returns
   */
  static transferTradToSimple(str: string) {
    const cnchars = require('cn-chars');
    let result = '';
    const array = str.split('');
    for (const i in array) {
      result = result + cnchars.toSimplifiedChar(array[i]);
    }
    return result;
  }

  /**
   * 字符串-簡體轉繁體
   * @param str
   * @returns
   */
  static transferSimpleToTrad(str: string) {
    const cnchars = require('cn-chars');
    let result = '';
    const array = str.split('');
    for (const i in array) {
      result = result + cnchars.toTraditionalChar(array[i]);
    }
    return result;
  }

  /**
   * 獲取所有英文月份
   * @returns
   */
  static getAllMonthEN() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  static getMimeType(objectName: string) {
    const mimeType = mime.getType(objectName);
    if (!mimeType) throw new HttpErrors.BadRequest('文件类型错误或不存在!');
    else return mimeType;
  }

  /**
   * 数组对象去重
   * @param arr 数组对象
   * @param arrFilterKeys 去重key，以arrFilterKey model为template
   */
  public filterData(arr: AnyObject, arrFilterKeys: arrFilterKey) {
    let map = new Map();
    return arr.filter((item: any) =>
      !map.has(item.emplid, item.company) && map.set(item.emplid, item.company))
  }
}
