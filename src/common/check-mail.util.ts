import {HttpErrors} from '@loopback/rest';

/**
  * 校验eamil 格式正确
  * @param str
  * @returns
  */
export function checkMailIsLegal(email: string | string[]) {
  const emails = (email instanceof Array ? email : [email]).filter(item => item && item !== 'NONE');
  const isLegal = emails.every(item => item?.toLowerCase().includes('@wistron.com') || item?.toLowerCase().includes('@wistronits.com'));
  if (emails.length && isLegal) return emails.map(item => item.toLowerCase()).join(';');
  else throw new HttpErrors.BadRequest(`收件地址不正確:${emails.join(';')}`);
}
