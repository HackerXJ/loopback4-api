import {AnyObject} from '@loopback/repository';
import {HttpErrorCode} from './http-error-code';
import {HttpResponseType} from './http-response-type';

export class HttpResponse {
  public constructor(public code: HttpErrorCode, public message: HttpResponseType, public data?: AnyObject) { }
}
