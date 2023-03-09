import {inject} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {ElasticsearchApi} from './elasticsearch.api';
import {ElasticsearchServiceConstant} from './elasticsearch.service.constant';

export class ElasticsearchService {
  public readonly name = 'es.service';
  constructor(
    @inject(ElasticsearchServiceConstant.SERVICE_ELASTICSEARCH_INJECT)
    protected esApi: ElasticsearchApi,
  ) { }

  public async get3Color(query: AnyObject): Promise<AnyObject> {
    return this.esApi.get3Color(query);
  }
}
