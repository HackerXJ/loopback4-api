import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {ElasticsearchComponent} from './component/elastic-search';
// import {TimerControllerJob} from './corn/timer-control';
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent
} from '@loopback/authentication-jwt';
import log4js from "log4js";
import moment from 'moment';
import {TimerControllerJob} from './corn/timer-control';
import {MySequence} from './sequence';
export {ApplicationConfig};

export class IsbmmApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //application 启动配置logger,全局控制
    log4js.configure({
      appenders: {cheese: {type: "file", filename: "logs/" + moment().format("YYYY/MM/DD") + ".log"}},//filename为log文件存储路径
      categories: {default: {appenders: ["cheese"], level: "error"}},
    });
    const logger = log4js.getLogger();
    logger.level = "debug";
    logger.debug("Application start output some debug messages");
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });


    // ------ add authentication before ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // ------ add authentication after ---------


    this.component(RestExplorerComponent);
    this.component(ElasticsearchComponent);
    // this.component(DmcsearchComponent);
    // this.component(parmeterComponent);

    this.component(CronComponent);
    // 异常历史记录存储Job
    // const jobBind = createBindingFromClass(ExceptionHistoryRecordJob);
    // this.add(jobBind);

    const TimerBind = createBindingFromClass(TimerControllerJob);
    this.add(TimerBind);

    // const ReflowTempBind = createBindingFromClass(ReflowHistoryTempRecordJob);
    // this.add(ReflowTempBind);

    // ------ add global log after ---------
    // const ReflowFreqBind = createBindingFromClass(ReflowHistoryFreqRecordJob);
    // this.add(ReflowFreqBind);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
