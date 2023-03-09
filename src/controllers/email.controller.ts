import {service} from '@loopback/core';
import {post, requestBody, tags} from '@loopback/rest';
import Mail from 'nodemailer/lib/mailer';
import {MailDesignService} from '../services';
import {EmailService} from '../services/email/email.service';

@tags("email exmaple=>email template api")
export class EmailController {
  constructor(
    @service(MailDesignService)
    private mailDesignService: MailDesignService,
    @service(EmailService)
    private emailService: EmailService
  ) { }

  /**
* 發送郵件
* @param mailOption 根据需求按照邮件格式传入邮件内容，邮件格式参考Mail.Options 源代码
* @returns
*/
  @post('/email/testsendMail', {
    summary: "發送郵件",
    responses: {
      '204': {
        //content: {'application/json': {schema: {type: 'string'}}},
      },
    },
  })
  async testsendMail(@requestBody() mailOption: Mail.Options) {
    // const errorMail = checkMailIsLegal(mailOption);
    const receiver = {
      email: "example@wistronits.com",
      name: "test"
    }
    const mailBody = this.mailDesignService.signMailDesign(receiver);
    await this.emailService.sendMail(mailBody);
  }
}
