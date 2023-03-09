import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as Config from '../../config/config.json';
import {InitProjectLogsRepository} from '../../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  constructor(/* Add @inject to inject parameters */
    @repository(InitProjectLogsRepository)
    public initProjectLogsRepository: InitProjectLogsRepository
  ) { }

  /**
* 發送郵件
* @param mailOption 根据需求按照邮件格式传入邮件内容，邮件格式参考Mail.Options 源代码
* @returns
*/
  //发送邮件
  async sendMail(mailOption: Mail.Options) {
    mailOption.from = Config.email_config.auth.user;
    const transport = nodemailer.createTransport(Config.email_config);
    await transport.sendMail(mailOption).catch(err => {
      //记录邮件发送错误内容到initproject_logs表中
      this.initProjectLogsRepository.create({
        //timestamp: moment().format("YYYY/MM/DD HH:mm:ss"),
        exception: err.syscall ? err.syscall : "",
        level: "error",
        message: err.message ? err.message : "",
        log_event: err,
        function: "sendMail"
      });
      throw new HttpErrors.BadGateway('郵件發送失敗');
    });
  }
}
