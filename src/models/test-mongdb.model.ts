import {Entity, model, property} from '@loopback/repository';

@model({
  name: "testdb"
  // settings: {
  //   // model definition goes in here
  //   mongodb: {collection: "testdb"},
  // },
})
export class TestMongDB extends Entity {
  @property({
    type: "string",
    id: true,
    generated: true,
    //mongodb: {dataType: 'ObjectId'}
  })
  _id: string;

  @property({
    type: "string",
    // mongodb: {
    //   fieldName: "name",
    // },
  })
  name?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TestMongDB>) {
    super(data);
  }
}

export interface TestMongDBRelations {
  // describe navigational properties here
}

export type TestMongDBWithRelations = TestMongDB;
