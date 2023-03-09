import {BindingScope, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpResponseType} from './model';
import {HttpResponse} from './model/http-response';

@injectable({scope: BindingScope.TRANSIENT})
export class HttpResponseService {
  // constructor() { }

  /**
   * api 請求成功返回結果格式定義
   * @param array 返回結果
   * @returns 請求成功返回結果格式
   */
  public success(code: number, array: AnyObject) {
    return new HttpResponse(
      code, HttpResponseType.OK, array);
  }



  /**
   * api 請求失敗返回結果格式定義
   * @param array 返回結果
   * @returns 請求成功返回結果格式
   */
  public errors(code: number, message: HttpResponseType) {
    return new HttpResponse(
      code, message);
  }




}
