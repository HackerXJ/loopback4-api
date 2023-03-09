import {service} from '@loopback/core';
import {AnyObject, CountSchema, Filter, Where} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, tags
} from '@loopback/rest';
import log4js from "log4js";
import moment from 'moment';
import {PcbaUsers} from '../models/pcba-users.model';
import {HrEmpService} from '../services';

@tags("exmaple=>template api")
export class PcbaUsersController {
  constructor(
    @service(HrEmpService)
    public hrEmpService: HrEmpService,
    public logger = log4js.getLogger()
  ) { }



  //@permisson('loopback.demo.view')
  @get('/pcba-users/count', {
    summary: "统计表HrEmp数量",
    responses: {
      '200': {
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(PcbaUsers) where?: Where<PcbaUsers>,
  ): Promise<number> {
    return 2626;
    //return this.pcbaUsersRepository.count(where);
  }

  //@permisson('loopback.demo.view')
  @get('/pcba-users/getHrEmpData', {
    summary: "查询表HrEmp数据",
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PcbaUsers, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async getHrEmpData(
    @param.filter(PcbaUsers) filter?: Filter<PcbaUsers>,
  ): Promise<AnyObject | undefined> {
    return this.hrEmpService.getHrEmpData(filter);

  }

  /**
 * 根据plant查询es数据
 * @param plant  厂别
 * @returns
 */
  @get('/getDailyReport', {
    summary: "根据plant查询es数据",
    responses: {
      '200': {
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async getDailyReport(
    @param.query.string('plant') plant: string,
    //@param.array('lines', 'query', {type: 'string'}) lines: string[],
  ): Promise<AnyObject | undefined> {
    this.logger.info("opendata", plant);
    this.logger.info("Cheese is Comté.");
    this.logger.warn("Cheese is quite smelly.");
    console.log(moment().format("YYYY/MM/DD HH:mm:ss"));
    return this.hrEmpService.getDailyReport(plant);
  }
}
