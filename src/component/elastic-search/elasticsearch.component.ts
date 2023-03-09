import {Binding, Component} from '@loopback/core';
import {ElasticsearchProvider} from './services/elasticsearch.provider';
import {ElasticsearchService} from './services/elasticsearch.service';
import {ElasticsearchServiceConstant} from './services/elasticsearch.service.constant';

export class ElasticsearchComponent implements Component {
  /**
   * 服務綁定
   *
   * @memberof ElasticsearchComponent
   */
  public bindings: Binding[] = [
    Binding.bind(
      ElasticsearchServiceConstant.SERVICE_ELASTICSEARCH_INJECT,
    ).toProvider(ElasticsearchProvider),
    Binding.bind(ElasticsearchServiceConstant.SERVICCE_BINDING).toClass(
      ElasticsearchService,
    ),
  ];
}
