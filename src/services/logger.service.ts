import {BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import fs from 'fs';
import {from} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorCode, HttpResponseService} from '../common/utils';
import {ElasticsearchApi, ElasticsearchServiceConstant} from '../component/elastic-search';
import {PcbaUsersRepository} from '../repositories';


@injectable({scope: BindingScope.TRANSIENT})
export class LoggerService {
  constructor(
    @inject(ElasticsearchServiceConstant.SERVICE_ELASTICSEARCH_INJECT)
    private esApi: ElasticsearchApi,
    @repository(PcbaUsersRepository)
    public pcbaUsersRepository: PcbaUsersRepository,
    public httpResponseService = new HttpResponseService()
  ) {
  }


  /** 根据日期條件查询logger日志
   * @param month 月份
   * @returns
   */
  public geFindLogFile(
  ) {
    return from(this.getLogDir()).pipe(
      map(result =>
        this.httpResponseService.success(HttpErrorCode.SUCCESS, result)
      ),
      catchError(
        async error =>
          this.httpResponseService.errors(400, error.message),
      )
    ).toPromise();
  }


  getLogDir(): Promise<[]> {
    return new Promise((resolve, reject) => {
      fs.readdir('././logs/' + new Date().getFullYear(), "utf-8", function (err, result) {
        if (err) {
          console.log(err);
        }
        let filecontent: any = [];
        if (result.length) {
          result.forEach(filepath => {
            let data = fs.readdirSync("././logs/" + new Date().getFullYear() + "/" + filepath);
            if (data.length) {
              data.forEach(f => {
                filecontent.push(new Date().getFullYear() + "/" + filepath + "/" + f);
              })
            }
          })
        }
        resolve(filecontent);
      })
    })
  }


  /** 根据日期條件查询logger日志
     * @param month 月份
     * @returns
     */
  public geFindLoggerData(
    day: string,
  ) {
    return from(this.getDayLogContent(day)).pipe(
      map(result =>
        result
      ),
      catchError(
        async error =>
          this.httpResponseService.errors(400, error.message),
      )
    ).toPromise();
  }

  getDayLogContent(day: string): Promise<String> {
    return new Promise((resolve, reject) => {
      fs.readFile('././logs/' + day + ".log", "utf-8", function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
    })
  }

  /** 根据日期條件删除logger日志
   * @param month 月份
   * @returns
   */
  public getDeleteLoggerData(
    month: number
  ) {
    fs.readdir('././logs/', function (err: NodeJS.ErrnoException | null, result: string[]) {
      if (err) {
        return console.log('文件读取失败!' + err.message);
      }
      console.log(result, new Date().getFullYear());
      result.forEach(item => {
        if (Number(item) < new Date().getFullYear()) {
          fs.rmdirSync("././logs/" + item, {recursive: true});
        } else {
          fs.readdir('././logs/' + item, function (err: NodeJS.ErrnoException | null, data: string[]) {
            console.log("data", data);
            if (data) {
              data.forEach((f: string) => {
                console.log("f", f.includes("0") ? f.substring(1) : f)
                if (Number(f.includes("0") ? f.substring(1) : f) <= (new Date().getMonth() + 1) - month) {
                  if ("././logs/" + item + "/" + f) {
                    fs.rmdirSync("././logs/" + item + "/" + f, {recursive: true});
                  }
                }
              })
            }
          });
        }
      })
    });
  }


}

