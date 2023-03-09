import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IsbmmMongDbDataSource} from '../datasources';
import {TestMongDB, TestMongDBRelations} from '../models/test-mongdb.model';

export class TestMongDBRepository extends DefaultCrudRepository<
  TestMongDB,
  typeof TestMongDB.prototype._id,
  TestMongDBRelations
> {
  constructor(
    @inject('datasources.isbmmDB') dataSource: IsbmmMongDbDataSource,
  ) {
    super(TestMongDB, dataSource);
  }
}
