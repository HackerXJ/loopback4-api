import {BindingScope, inject, injectable} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {from} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpResponseService} from '../common/utils';
import {HttpErrorCode} from '../common/utils/http-response';
import {ElasticsearchApi, ElasticsearchServiceConstant} from '../component/elastic-search';
import {PcbaUsers} from '../models/pcba-users.model';
import {PcbaUsersRepository} from '../repositories';


@injectable({scope: BindingScope.TRANSIENT})
export class HrEmpService {
  constructor(
    @inject(ElasticsearchServiceConstant.SERVICE_ELASTICSEARCH_INJECT)
    private esApi: ElasticsearchApi,
    @repository(PcbaUsersRepository)
    public pcbaUsersRepository: PcbaUsersRepository,
    public httpResponseService = new HttpResponseService()
  ) {
  }

  /** 根據filter條件過濾數據庫數據
   * @param filter 数据库表字段
   * @returns filter條件過濾數據庫數據
   */
  async getHrEmpData(
    filter?: Filter<PcbaUsers>,
  ): Promise<AnyObject | undefined> {
    return from(this.pcbaUsersRepository.find(filter)).pipe(
      map(result =>
        this.httpResponseService.success(HttpErrorCode.SUCCESS, result)
      ),
      catchError(
        async error =>
          this.httpResponseService.errors(400, error.message),
      )
    ).toPromise();
  }

  /** 根據filter條件過濾數據庫數據
   * @param filter 数据库表字段
   * @returns filter條件過濾數據庫數據
   */
  async getDailyReport(
    plant: string,
    //lines: string[]
  ): Promise<AnyObject | undefined> {
    const query = this.getQuery(plant);
    return from(this.esApi.get3Color(query)).pipe(
      map(result =>
        this.httpResponseService.success(HttpErrorCode.SUCCESS, result)
      ),
      catchError(
        async error =>
          this.httpResponseService.errors(400, error.message),
      )
    ).toPromise();
  }

  getQuery(
    plant: string,
  ) {
    return {
      size: 1,
      query: {
        bool: {
          must: [
            {
              term: {
                'plant.raw': plant,
              },
            },
            // {
            //   terms: {
            //     'line.raw': lines,
            //   },
            // },
            // {
            //   term: {
            //     'machineName.raw': machineName,
            //   },
            // },
            // {
            //   range: {
            //     evt_dt: {
            //       gte: timeRange.totalFrom,
            //       lt: timeRange.totalTo - 1,
            //     },
            //   },
            // },
          ],
          //must_not: {term: {"recheck": true}}
        },
      },
    }
  }
}
