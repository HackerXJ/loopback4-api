/**
 * 專案名稱： pcba_digital_maintain
 * 檔案說明：Kafka Consumer Option
 * 部門代號： SPWC IC3521
 * @CREATE Tuesday, 22nd June 2021 2:59:13 pm
 * @author HackerXu
 * @contact faith_yang@wistronits.com
 * -----------------------------------------------------------------------------
 * @NOTE
 */

export class KafkaProducerOption {
  constructor(
    public kafkaHost: string,
    public topic: string,
    public registryHost: string,
    public username?: string,
    public password?: string,
  ) { }
}
