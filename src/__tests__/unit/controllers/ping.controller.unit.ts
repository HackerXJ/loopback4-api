import {AnyObject} from '@loopback/repository';
import {HttpResponseService} from '../../../common/utils';
import {ElasticsearchApi} from '../../../component/elastic-search';
import {PcbaUsersController} from '../../../controllers/example.controller';
import {IsbmmDbDataSource} from '../../../datasources';
import {PcbaUsersRepository} from '../../../repositories';
import {HrEmpService} from '../../../services';

describe('PingController() unit', () => {
  // it('pings with no input', () => {
  //   const controller = new PingController();
  //   const result = controller.ping();
  //   expect(result).to.equal({
  //     greeting: 'Hello from LoopBacks'
  //   });
  // });
  it("pings with msg 'hello'", async () => {
    const esApi: ElasticsearchApi = {
      async get3Color(query: AnyObject): Promise<AnyObject> {
        return query;
      }
    }
    const controller = new PcbaUsersController(new HrEmpService(esApi, new PcbaUsersRepository(new IsbmmDbDataSource()), new HttpResponseService()));
    const result = await controller.count();
    console.log("result:", result);
    // expect(result).to.equal({
    //   greeting: 'Hello from LoopBacks'
    // });
  });
})
