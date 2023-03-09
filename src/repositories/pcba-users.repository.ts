import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IsbmmDbDataSource} from '../datasources';
import {PcbaUsers, PcbaUsersRelations} from '../models/pcba-users.model';

export class PcbaUsersRepository extends DefaultCrudRepository<
  PcbaUsers,
  typeof PcbaUsers.prototype.emplid,
  PcbaUsersRelations
> {
  constructor(
    @inject('datasources.isbmmDB') dataSource: IsbmmDbDataSource,
  ) {
    super(PcbaUsers, dataSource);
  }
}
