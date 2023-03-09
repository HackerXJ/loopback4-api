import {
  get
} from '@loopback/rest';
import log4js from "log4js";
/**
 * OpenAPI response for ping()
 */
// const PING_RESPONSE: ResponseObject = {
//   description: 'Ping Response',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         title: 'PingResponse',
//         properties: {
//           greeting: {type: 'string'},
//           date: {type: 'string'},
//           url: {type: 'string'},
//           headers: {
//             type: 'object',
//             properties: {
//               'Content-Type': {type: 'string'},
//             },
//             additionalProperties: true,
//           },
//         },
//       },
//     },
//   },
// };

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  //constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }
  public logger = log4js.getLogger();
  // Map to `GET /ping`
  @get('/ping')
  //@response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    this.logger.info("ping start");
    return {
      greeting: 'Hello from LoopBack',
      //date: new Date(),
      //url: this.req.url,
      //headers: Object.assign({}, this.req.headers),
    };
  }
}
