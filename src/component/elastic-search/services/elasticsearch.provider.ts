import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {IsbmmEsDataSource} from '../../../datasources';
import {ElasticsearchApi} from './elasticsearch.api';

export class ElasticsearchProvider implements Provider<ElasticsearchApi> {
  constructor(
    @inject('datasources.isbmm_es')
    protected dataSource: IsbmmEsDataSource = new IsbmmEsDataSource(),
  ) { }
  value(): Promise<ElasticsearchApi> {
    return getService(this.dataSource);
  }
}
