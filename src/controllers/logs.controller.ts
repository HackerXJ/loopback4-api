import {service} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, tags
} from '@loopback/rest';
import log4js from "log4js";
import {from} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorCode, HttpResponseService} from '../common/utils';
import {InitProjectLogs} from '../models';
import {InitProjectLogsRepository} from '../repositories';
import {LoggerService} from '../services';

@tags("logs example=>log template api")
export class LogsController {
  constructor(
    @repository(InitProjectLogsRepository)
    public initProjectLogsRepository: InitProjectLogsRepository,
    @service(LoggerService)
    public loggerService: LoggerService,
    public httpResponseService = new HttpResponseService(),
    public logger = log4js.getLogger()
  ) { }

  /**
* 查询表initproject_logs数据
* @param filter 数据库查询字段
* @returns
*/
  @get('/logs/getLogData', {
    summary: "查询表initproject_logs数据",
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(InitProjectLogs, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async getLogData(
    @param.filter(InitProjectLogs) filter?: Filter<InitProjectLogs>,
  ): Promise<AnyObject | undefined> {
    return from(this.initProjectLogsRepository.find(filter)).pipe(
      map(result =>
        this.httpResponseService.success(HttpErrorCode.SUCCESS, result)
      ),
      catchError(
        async error =>
          this.httpResponseService.errors(400, error.message),
      )
    ).toPromise();
  }


  /**
 * 根据日期條件查询logger日志
 * @param day 日期
 * @returns
 */
  @get('/logs/geFindLogFile', {
    summary: "查询logger文件目录",
    responses: {
      '200': {
        content: {
          'application/json': {
          },
        },
      },
    },
  })
  async geFindLogFile(
    //@param.query.string("day") day: string,
  ) {
    return this.loggerService.geFindLogFile();
  }



  /**
* 根据日期條件查询logger日志
* @param day 日期
* @returns
*/
  @get('/logs/geFindLoggerData', {
    summary: "根据日期條件查询logger日志",
    responses: {
      '200': {
        content: {
          'application/json': {
          },
        },
      },
    },
  })
  async geFindLoggerData(
    @param.query.string("day") day: string,
  ) {
    return this.loggerService.geFindLoggerData(day);
  }


  /**
* 查询表initproject_logs数据
* @param month 月份
* @returns
*/
  @get('/logs/getDeleteLoggerData', {
    summary: "根据日期條件删除logger日志",
    responses: {
      '200': {
        content: {
          'application/json': {
          },
        },
      },
    },
  })
  async getDeleteLoggerData(
    @param.query.number("month") month: number,
  ) {
    return this.loggerService.getDeleteLoggerData(month);
  }
}
