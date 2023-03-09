import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    //idInjection: false,
    postgresql: {schema: 'BPMDEV', table: 'HR_Emp'},
  },
})
export class PcbaUsers extends Entity {
  @property({
    type: 'string',
    required: true,
    length: 20,
    id: 1,
    postgresql: {
      columnName: 'EMPLID',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  emplid: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'CNAME',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  cname?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'ENAME',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  ename?: string;

  @property({
    type: 'string',
    length: 10,
    postgresql: {
      columnName: 'PLANT',
      dataType: 'character varying',
      dataLength: 10,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  plant?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'MAIL',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  mail?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'DEPTID',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  deptid?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'UPPER_DEPT',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  upperDept?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'EMPL_CATEGORY',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  emplCategory?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'SUPERVISOR',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  supervisor?: string;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'OFFICER_LEVEL',
      dataType: 'numeric',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  officerLevel?: number;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'CARDID',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  cardid?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'TDATE',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  tdate?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {
      columnName: 'TREASON',
      dataType: 'character varying',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  treason?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'UDATE',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  udate?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {
      columnName: 'USERID',
      dataType: 'character varying',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  userid?: string;

  @property({
    type: 'string',
    length: 10,
    postgresql: {
      columnName: 'COMPANY',
      dataType: 'character varying',
      dataLength: 10,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  company?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'DEPTN',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  deptn?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'HDATE',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  hdate?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'DESCRSHORT',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  descrshort?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'REHIRE_DT',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  rehireDt?: string;

  @property({
    type: 'string',
    length: 1,
    postgresql: {
      columnName: 'ADULT',
      dataType: 'character varying',
      dataLength: 1,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  adult?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {
      columnName: 'PHONE',
      dataType: 'character varying',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  phone?: string;

  @property({
    type: 'string',
    length: 30,
    postgresql: {
      columnName: 'site',
      dataType: 'character varying',
      dataLength: 30,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  site?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PcbaUsers>) {
    super(data);
  }
}

export interface PcbaUsersRelations {
  // describe navigational properties here
}

export type PcbaUsersWithRelations = PcbaUsers;
