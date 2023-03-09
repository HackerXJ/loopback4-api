import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import Mail, {Address} from 'nodemailer/lib/mailer';
// import {UI_EMAIL_CONFIG, UI_SIGN_CONFIG} from '../config';
// const signUrl = UI_SIGN_CONFIG;
// const emailUrl = UI_EMAIL_CONFIG;

type TO = string | Address | Array<string | Address> | undefined;
// export interface MailData {
//   name?: string;
//   form_no?: string;
//   remark?: string;
// }
export interface Receiver {
  email?: TO;
  name?: string;
}
const HTML_HEAD = `
<!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            .sn_table {
                text-align: center;
                border: 1px solid #000000;
                border-collapse: collapse;
            }

            .sn_table th,
            .sn_table td {
                border: 1px solid #000000;
                padding: 4px;
            }
        </style>
    </head>
    <body>
      <table style="background-color:rgb(187,224,227);width: 1000px;">`;
const HTML_FOOT = `
<tr><td>&nbsp;&nbsp;This message is sent by test system. You may not reply this email directly.</td></tr>
<tr><td>&nbsp;&nbsp;Help desk: 7936</td></tr>
</table></body></html>`;
@injectable({scope: BindingScope.TRANSIENT})
export class MailDesignService {
  constructor(/* Add @inject to inject parameters */) { }

  /**
* 组装邮件发送内容
* @param receiver 邮件格式内容
* @returns
*/
  signMailDesign(receiver: Receiver): Mail.Options {
    const subject = `SPIM Message (items need your approval!!）新设备导入签核提醒通知)`;
    let html = HTML_HEAD;
    html += `
    <tr><td>Dear ${receiver.name}:</td></tr>
    <tr><td>&nbsp;&nbsp;These forms are pending in your inbox !!</td></tr>
    <tr><td>&nbsp;&nbsp;Please open these forms via below hyper link for reviewing.</td></tr>
    <tr><td><br /><table class="sn_table">
    <tr><th>Form No.</th><th>Device Name</th><th>Step</th></tr>`;
    // mailData.forEach(item => {
    //   html += `<tr><td><a href="${"url"}">${item.form_no}</a></td><td>${item.name}</td><td>EHS</td></tr>`;
    // });
    html += `</table><br /></td></tr>`;
    html += HTML_FOOT;
    const options: Mail.Options = {to: receiver.email, subject, html};
    return options;
  }

}
