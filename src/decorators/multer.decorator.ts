/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response} from '@loopback/rest';
import multer from 'multer';
// target 对应的是被装饰的属性所属类的原型，这里指 multerTransReq.prototype
// key 对应的是'getName'
// descriptor 对应的是 {
//   value: [Function: getName],
//   writable: true,
//   enumerable: false,
//   configurable: true
// }
export function multerTransReq() {
  return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    const func: Function = propertyDescriptor.value;
    propertyDescriptor.value = async function (reqRaw: Request, resRaw: Response, ...args: any[]) {
      const {req, res} = await multerCb(reqRaw, resRaw);
      return func.call(this, req, res, ...args);
    };
  };
}
function multerCb(req: Request, res: Response) {
  // https://github.com/expressjs/multer
  return new Promise<{req: Request; res: Response}>((resolve, reject) => {
    // 内存存储引擎 (MemoryStorage) 内存存储引擎将文件存储在内存中的 Buffer 对象,注意上传大文件可能导致内存不够
    const storage = multer.memoryStorage();
    const multerAny = multer({storage}).any();
    multerAny(req, res, (err: any) => {
      if (err) reject('上传资料有误' + err?.message);
      resolve({req, res});
    });
  });
}
