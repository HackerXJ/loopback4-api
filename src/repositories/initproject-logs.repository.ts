import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IsbmmDbDataSource} from '../datasources';
import {InitProjectLogs, InitProjectLogsRelations} from '../models/initproject-logs.model';

export class InitProjectLogsRepository extends DefaultCrudRepository<
  InitProjectLogs,
  typeof InitProjectLogs.prototype.id,
  InitProjectLogsRelations
> {
  constructor(
    @inject('datasources.isbmmDB') dataSource: IsbmmDbDataSource,
  ) {
    super(InitProjectLogs, dataSource);
  }
}
