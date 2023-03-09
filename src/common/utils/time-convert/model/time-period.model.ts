import {TimePeriodType} from '../time-constant';

export class TimePeriodModel {
  constructor(
    public from: number,
    public to: number,
    public type: TimePeriodType = TimePeriodType.DAY,
  ) {}
}
