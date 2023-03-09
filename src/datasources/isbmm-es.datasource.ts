import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as CONFIG from '../config/config.json';

const config = CONFIG.es;

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class IsbmmEsDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'isbmm_es';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.isbmm_es', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
