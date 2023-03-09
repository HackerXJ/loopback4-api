import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as CONFIG from '../config/config.json';

const config = CONFIG.isbmmDB;

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class IsbmmDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'isbmmDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.isbmmDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
