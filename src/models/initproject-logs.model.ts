import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    //idInjection: false,
    postgresql: {schema: 'DLR', table: 'initproject_logs'},
  },
})
export class InitProjectLogs extends Entity {
  @property({
    type: 'number',
    id: 1,
    postgresql: {
      columnName: 'id',
      dataType: 'numeric',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  id?: number;


  @property({
    type: 'date',
    postgresql: {
      columnName: 'timestamp',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  timestamp?: string;

  @property({
    type: 'string',
    required: true,
    length: 200,
    postgresql: {
      columnName: 'exception',
      dataType: 'character varying',
      dataLength: 200,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  exception?: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {
      columnName: 'level',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  level?: string;


  @property({
    type: 'string',
    required: true,
    length: 1000,
    postgresql: {
      columnName: 'message',
      dataType: 'character varying',
      dataLength: 1000,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  message?: string;

  @property({
    type: 'object',
    required: true,
    length: 1000,
    postgresql: {
      columnName: 'log_event',
      dataType: 'character varying',
      dataLength: 1000,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  log_event?: object;


  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: {
      columnName: 'function',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  function?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<InitProjectLogs>) {
    super(data);
  }
}

export interface InitProjectLogsRelations {
  // describe navigational properties here
}

export type InitProjectLogsWithRelations = InitProjectLogs;
