import {BindingKey} from '@loopback/core';
import {ElasticsearchService} from './elasticsearch.service';

export namespace ElasticsearchServiceConstant {
  export const SERVICE_ELASTICSEARCH_INJECT = 'service.elasticsearch.api';
  export const SERVICCE_BINDING = BindingKey.create<ElasticsearchService>(
    'service.elasticsearch',
  );
}
