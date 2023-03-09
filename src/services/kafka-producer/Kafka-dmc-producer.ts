import {HighLevelProducer, KafkaClient, Producer} from 'kafka-node';
import {
  ConfluentAvroStrategy,
  ConfluentMultiRegistry,
  ConfluentPubResolveStrategy,
  ProducerResolveStrategy
} from 'wisrtoni40-confluent-schema/lib';
import {HttpErrorCode, HttpResponseType} from '../../common/utils';
import {HttpResponse} from '../../common/utils/http-response/model/http-response';
import * as CONFIG from "../../config/config.json";
import {KafkaProducerAbstract} from './kafka-producer-abstract.service';
import {KafkaProducerOption} from './model/kafka-producer-option';

export class KafkaDmcProduct extends KafkaProducerAbstract {
  private producer: Producer;
  private resolver: ProducerResolveStrategy;
  private kafkaClient: KafkaClient;
  private option: KafkaProducerOption;
  private useKafka2 = CONFIG.kafka.kafka2;

  // 暂无重连机制
  private retryCount: number;
  private retryCountTarget: number = 3;
  private reConnectTimeOut: NodeJS.Timeout;

  constructor(option: KafkaProducerOption) {
    super();
    this.option = option;
    this.initKafka();
  }

  /**
   * 创建kafkaClient
   * @returns
   */
  initKafka() {
    //配置kafka
    this.kafkaClient = new KafkaClient({
      kafkaHost: this.option.kafkaHost,
      connectTimeout: 3000,
      requestTimeout: 3000,
      connectRetryOptions: {
        retries: 2,
        factor: 0,
        minTimeout: 3000,
        maxTimeout: 3000,
        randomize: false,
      },
    });
    const schemaRegistry = new ConfluentMultiRegistry(this.option.registryHost);
    const avro = new ConfluentAvroStrategy();
    this.resolver = new ConfluentPubResolveStrategy(
      schemaRegistry,
      avro,
      this.option.topic,
    );
  }

  /**
   * kafka 发送数据
   * API中，每一次发送都创建一个Producer，发送完成后，关闭连接
   * @param kafkaSendData
   */
  async sendkafkaData(sendData: any): Promise<any> {
    this.producer = new HighLevelProducer(this.kafkaClient, {
      requireAcks: 1,
      ackTimeoutMs: 100,
    });
    let ready = await this.isProducerReady();
    if (ready != 'true') {
      return new HttpResponse(HttpErrorCode.SYSTEM_ERROR, HttpResponseType.NG);
    }
    let topic = this.option.topic;
    let result;
    if (this.useKafka2) {
      result = await this.kafka2Send(topic, sendData);
    } else {
      result = await this.kafka1Send(topic, sendData);
    }
    console.log('result:', result);
    if (Object.keys(result).includes('error')) {
      return new HttpResponse(
        HttpErrorCode.SYSTEM_ERROR, HttpResponseType.NG);
    } else {
      return new HttpResponse(HttpErrorCode.SUCCESS, HttpResponseType.OK, result);
    }
  }

  kafka1Send(topic: string, kafkaSendData: any) {
    return new Promise<any>((resolve, reject) => {
      this.producer.send(
        [{topic, messages: JSON.stringify(kafkaSendData)}],
        (error: any, result: any) => {
          this.producer.close();
          if (result) {
            resolve(result);
          }
          if (error) {
            resolve(this.producerSendError(error));
          }
        },
      );
    });
  }
  kafka2Send(topic: string, kafkaSendData: any) {
    return new Promise<any>(async (resolve, reject) => {
      const processedData = await this.resolver.resolve(kafkaSendData);
      this.producer.send(
        [{topic, messages: processedData}],
        (error: any, result: any) => {
          this.producer.close();
          if (result) {
            resolve(result);
          }
          if (error) {
            resolve(this.producerSendError(error));
          }
        },
      );
    });
  }
  /**
   * 如果kafka producer报错，一直重连
   * @param error kafka producer error info
   */
  producerSendError(error: any) {
    // this.retryCount++;
    // if (this.retryCount <= this.retryCountTarget) {
    //   this.reConnectTimeOut = setTimeout(
    //     this.sendkafkaData.bind(this),
    //     5 * 1000,
    //   );
    // } else {
    //   clearTimeout(this.reConnectTimeOut);
    // }
    // 暂定不重抛
    console.log(error);
    return error;
  }

  isProducerReady() {
    return new Promise<any>((resolve, reject) => {
      this.producer.on('ready', () => resolve('true'));
      this.producer.on('error', err => resolve(err));
    });
  }

  // new KafkaProducerOption(
  //   CONFIG.kafka.dmcProducer.kafkaHost,
  //   CONFIG.kafka.dmcProducer.topic,
  //   '',
  //   CONFIG.kafka.registryHost,
  //   CONFIG.kafka.dmcProducer.username,
  //   CONFIG.kafka.dmcProducer.password,
  // ),
}
function kafkaSendData(kafkaSendData: any, any: any) {
  throw new Error('Function not implemented.');
}
