import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, tags} from '@loopback/rest';
import {from} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorCode, HttpResponseService} from '../common/utils';
import {TestMongDB} from '../models';
import {TestMongDBRepository} from '../repositories';

@tags("test mongdb exmaple=> test mongdb")
export class TestMongDbController {
  constructor(
    @repository(TestMongDBRepository)
    private testMongDBRepository: TestMongDBRepository,
    public httpResponseService = new HttpResponseService()
  ) { }

  /**
* 获取TestDb数据
* @param filter
* @returns
*/
  @get('/pcba-users/getTestDbData', {
    summary: "根据id 查询mongdb testdb数据",
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TestMongDB, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async getTestDbData(
    @param.query.string("id") id: string
  ) {
    return from(this.testMongDBRepository.findById(id)).pipe(
      map(result =>
        this.httpResponseService.success(HttpErrorCode.SUCCESS, result)
      ),
      catchError(
        async error =>
          this.httpResponseService.errors(400, error.message),
      )
    ).toPromise();
  }
}
