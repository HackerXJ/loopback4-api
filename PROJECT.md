# 模块划分

## unit test

在test\unit\controllers 目录下新建测试的controller，根据业务类型进行划分controller，可通过调用controller中的方法进行测试，写法可参考ping.controller.unit.ts,unit test 命令如下：

```sh
npm test
```

## elasticsearch component

复制src\component文件夹和src\datasources\isbmm-es.datasource.ts，在application.ts中mount ElasticsearchComponent.

```ts
this.component(ElasticsearchComponent);
```

配套rxjs，参考xample.controller.ts中getDailyReport写法.


## cronjob

复制src\corn文件夹，在getInitTask中进行控制定时任务，在service中写业务逻辑.

## datasource

复制src\datasources中文件，更换config.json中isbmmDB的数据库配置.更多的手机配置model配置可参考[LoopBack 4 documentation](https://loopback.io/doc/en/lb4/Database-connectors.html).所有的数据库配置可通过下面两个命令，不同数据库因为config中connectors类型不同.

```sh
lb4 datasource
```

```sh
lb4 model
```

## log

如果记录到专案中，新建一个logs文件夹，在application.ts中全局配置：

```ts
log4js.configure({
      appenders: {cheese: {type: "file", filename: "logs/" + moment().format("YYYY/MM/DD") + ".log"}},
      //filename为log文件存储路径
      categories: {default: {appenders: ["cheese"], level: "error"}},
});
const logger = log4js.getLogger();
logger.level = "debug";
logger.debug("Application start output some debug messages");
```

引用log4js包，初始化log4js.getLogger()，可写入日志到logs文件夹中，全局配置按照日期自动写入.

如果记录到数据库中，可参考DATASOURCE.md initproject_logs表结构，lb4 model 生成initproject_logs 相应的表字段，通过lb4 crud操作写入数据库.

## minio

复制src\decorators文件夹和src\services\minio，参考src\controllers\minio-file-operation.controller.ts写法以及注释，如果需要同步数据到数据库，可建立数据库和minio 文件路径关联表.

## eamil

复制src\services\email文件夹，参考src\controllers\email.controller.ts写法以及注释，邮件格式封装在src\common\check-mail.util.ts中，可根据业务需求参考.

## kafka

复制src\services\kafka-producer文件夹

## timeconvert

复制src\common\utils\time-convert文件夹

## httpresponse

复制src\common\utils\http-response文件夹，参考src\services\hr-emp.service.ts写法以及注释.

## util

常用方法封装在src\common\general-handle.ts文件中


