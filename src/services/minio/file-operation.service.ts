import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Request} from '@loopback/rest';
import _ from 'lodash';
interface UplodaData {
  data: string;
}
@injectable({scope: BindingScope.TRANSIENT})
export class FileOperationService {
  constructor() { }
  getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const files = Array.isArray(uploadedFiles)
      ? _.map(uploadedFiles)
      : _.map(uploadedFiles, value => value[0]);
    return {files, fields: <UplodaData>request.body};
  }
  // 以下方式获取文件和数据可用，且使用上非常方便，一点不足就是会使用磁盘的临时文件夹
  // 上传过多文件可能导致临时文件夹占用过大，实际上该方式等同于multer的磁盘存储引擎 (DiskStorage)
  // async getFilesAndFields(request: Request) {
  //   const form = new multiparty.Form();
  //   const formParse = form.parse.bind(form);
  //   return toPromise(formParse, [request]);
  // }
  // getReadFile(files: UploadFile[][]) {
  //   const readFile = promisify(fs.readFile); // 讀文件為Buffer
  //   const reads = files.map(item => readFile(item[0].path));
  //   return Promise.all(reads);
  // }
  // getReadExcelFile(files: UploadFile[]) {
  //   const readFile = promisify(fs.readFile); // 讀文件為Buffer
  //   const reads = files.map(item => readFile(item.path));
  //   return Promise.all(reads);
  // }
}
