import {AnyObject} from '@loopback/repository';

export interface ElasticsearchApi {
  get3Color(query: AnyObject): Promise<AnyObject>;
}
