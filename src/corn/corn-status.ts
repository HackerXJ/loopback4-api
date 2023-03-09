import {CornTask} from './corn-task';

export function getInitTask() {
  const data = new CornTask();
  //const now = new Date();
  // if (now.getHours() == 12 && now.getMinutes() == 30) {
  data.pcbaRedColor = true;
  //}
  // if (now.getHours() == 12 && now.getMinutes() == 30) {
  //   data.pcbaPrinter = true;
  // }
  // if (now.getHours() == 12 && now.getMinutes() == 10) {
  //   data.pcbaReflowFrequency = true;
  // }
  // if (now.getHours() == 12 && now.getMinutes() == 50) {
  //   data.pcbaReflowTemp = true;
  // }
  return data;
}
