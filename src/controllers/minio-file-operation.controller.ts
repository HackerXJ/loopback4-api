import {inject, service} from '@loopback/core';
import {
  get,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  RequestBodyObject, Response,
  RestBindings,
  tags
} from '@loopback/rest';
import * as Config from '../config/config.json';
import {multerTransReq} from '../decorators';
import {FileOperationService, MinioOperationService} from '../services';

const requestFormBody: Partial<RequestBodyObject> = {
  description: 'multipart/form-data value.',
  required: true,
  content: {
    'multipart/form-data': {
      'x-parser': 'stream',
      schema: {type: 'object'},
    },
  },
};
interface Img {
  uid: string;
  name: string;
  status: string;
  url: string;
}

@tags("minio  exmaple=>minio operation template api")
export class MinioFileOperationController {
  constructor(
    @service() private fileOperationService: FileOperationService,
    @service() private minioOperationService: MinioOperationService,
  ) { }

  /**
* 根据minio文件路径+名称下载文件
* @param model  minio文件路径
* @param filename  minio文件名称
* @returns
*/
  @get('/fileoperation/fileDownload/{model}/{filename}', {
    summary: "根据minio文件路径+名称下载文件",
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async fileDownload(
    @param.path.string('model') model: string,
    @param.path.string('filename') filename: string,
  ) {
    const uploadFolder = model;
    if (!uploadFolder) throw new HttpErrors.BadRequest('model名錯誤!');
    const filepath = `${uploadFolder}/${filename}`;
    return this.minioOperationService.getObject(Config.minio.bucketName.Image, filepath);
  }

  /**
* 根据minio文件路径+名称删除文件
* @param model  minio文件路径
* @param filename  minio文件名称
* @returns
*/
  @get('/fileoperation/fileDelete/{model}/{filename}', {
    summary: "根据minio文件路径+名称删除文件",
    responses: {
      '200': {
        // content: {'application/json': {schema: {type: 'string'}}},
      },
    },
  })
  async fileDelete(
    @param.path.string('model') model: string,
    @param.path.string('filename') filename: string,
    // @requestBody() updateData: CommonModel,
  ) {
    const uploadFolder = model;
    if (!uploadFolder) throw new HttpErrors.BadRequest('model名錯誤!');
    const filapaths = `${uploadFolder}/${filename}`;
    await this.minioOperationService.removeObject(Config.minio.bucketName.Image, filapaths);
    //await this.baseConfigService.deleteFileAndUpdateData(model, filename, updateData);
  }

  /**
* 根据minio文件路径上传文件，只上传image
* @param model  minio文件路径
* @param req  上传文件
* @returns
*/
  @post('/fileoperation/uploadFileAndData/{model}', {
    summary: "根据minio文件路径上传文件,只上传image",
    responses: {
      200: {
        description: '上傳文件和數據',
      },
    },
  })
  @multerTransReq()
  async uploadFileAndData(
    @requestBody(requestFormBody) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.path.string('model') model: string,
  ) {
    const {files, fields} = this.fileOperationService.getFilesAndFields(req);
    const uploadFolder = model;
    if (!uploadFolder) throw new HttpErrors.BadRequest('model名錯誤!');
    const uploadData = JSON.parse(fields.data);
    if (uploadData.imgs) {
      const imgs: Img[] = JSON.parse(uploadData.imgs);
      const uploadFiles = files.map((file, index) => {
        const destPath = `${uploadFolder}/${imgs[index].name}`;
        return this.minioOperationService.putObject(Config.minio.bucketName.Image, destPath, file.buffer);
      });
      await Promise.all(uploadFiles).catch(err => console.log(err));
    }
    // await this.baseConfigService.createOrUpdateByModel(model, uploadData);
  }
}
