import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Response} from '@loopback/rest';
import {Client} from 'minio';
import {GeneralHandle} from '../../common/general-handle';
import * as config from '../../config/config.json';

@injectable({scope: BindingScope.TRANSIENT})
export class MinioOperationService {
  constructor() { }
  async downloadFileFromMinio(bucketName: string, objectName: string, response: Response) {
    const minioClient = new Client(config.minio.client);
    const head = {'Content-Type': GeneralHandle.getMimeType(objectName)};
    response.writeHead(200, head);
    const dataStream = await minioClient.getObject(bucketName, objectName);
    dataStream.pipe(response);
  }
  //获取文件
  async getObject(bucketName: string, objectName: string) {
    const minioClient = new Client(config.minio.client);
    return minioClient
      .getObject(bucketName, objectName)
      .catch(error => console.log('文件獲取失敗：', error?.message));
  }
  //
  async presignedGetObject(bucketName: string, objectName: string) {
    const minioClient = new Client(config.minio.client);
    return minioClient.presignedGetObject(bucketName, objectName);
  }
  //
  async batchPresignedGetObject(bucketName: string, objectName: string[]) {
    const minioClient = new Client(config.minio.client);
    const presignedItmes = objectName.map(item => minioClient.presignedGetObject(bucketName, item));
    return Promise.allSettled(presignedItmes);
  }
  //
  async fPutObject(bucketName: string, objectName: string, sourcePath: string) {
    const minioClient = new Client(config.minio.client);
    const options = {'Content-Type': GeneralHandle.getMimeType(objectName)};
    await minioClient.fPutObject(bucketName, objectName, sourcePath, options);
  }
  //
  async putObject(bucketName: string, objectName: string, sourceFile: Buffer | string) {
    const minioClient = new Client(config.minio.client);
    const options = {'Content-Type': GeneralHandle.getMimeType(objectName)};
    await minioClient.putObject(bucketName, objectName, sourceFile, options);
  }
  //删除文件
  async removeObject(bucketName: string, objectName: string) {
    const minioClient = new Client(config.minio.client);
    await minioClient.removeObject(bucketName, objectName);
  }
}
