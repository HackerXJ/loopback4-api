export abstract class KafkaProducerAbstract {
  abstract sendkafkaData(sendData: any): Promise<any>;
}
