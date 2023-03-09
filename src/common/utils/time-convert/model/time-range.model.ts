import {TimePeriodModel} from './time-period.model';

export class TimeRangeModel {
  constructor(
    public totalFrom: number,
    public totalTo: number,
    public range: TimePeriodModel[],
  ) {}
}
