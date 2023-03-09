import {BindingScope, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import moment from 'moment';
import {Constant} from '../../../config';
import {ShiftModel, TimePeriodModel} from './model';
import {TimeRangeModel} from './model/time-range.model';
import {TimePeriodType} from './time-constant';

@injectable({scope: BindingScope.TRANSIENT})
export class TimeConvertService {
  constructor(
  ) { }

  /**
   * 当班时间获取按小时分区的时间区间
   * @param shift 班别
   * @returns
   */
  public getShiftRangeByHour(shift: ShiftModel): TimeRangeModel {
    let shiftTime = this.getShiftRange(shift);
    return new TimeRangeModel(
      shiftTime.from,
      shiftTime.to,
      this.getTimeRangeByGap(shiftTime.from, shiftTime.to, TimePeriodType.HOUR),
    );
  }

  /**
   * 当班两个班时间获取按小时分区的时间区间
   * @param shift 班别
   * @returns
   */
  public getTwoShiftRangeByHour(shift: ShiftModel): TimeRangeModel {
    let shiftTime = this.getShiftRange(shift);
    return new TimeRangeModel(
      shiftTime.from - 12 * 60 * 60 * 1000,
      shiftTime.to,
      this.getTimeRangeByGap(
        shiftTime.from - 12 * 60 * 60 * 1000,
        shiftTime.to,
        TimePeriodType.HOUR,
      ),
    );
  }

  /**
   * 当班两个班时间获取按小时分区的时间区间
   * @param shift 班别
   * @returns
   */
  public getTwoRangeByHour(shift: ShiftModel): TimeRangeModel {
    let shiftTime = this.getRange(shift);
    return new TimeRangeModel(
      shiftTime.from - 12 * 60 * 60 * 1000,
      shiftTime.to,
      this.getTimeRangeByGap(
        shiftTime.from - 12 * 60 * 60 * 1000,
        shiftTime.to,
        TimePeriodType.HOUR2,
      ),
    );
  }

  /**
   * 当班时间获取按两小时分区的时间区间
   * @param shift 班别
   * @returns
   */
  public getShiftRangeBy10MIN(
    shift: ShiftModel,
    shiftTime: any,
  ): TimeRangeModel {
    // let shiftTime = this.getShiftRange(shift);
    return new TimeRangeModel(
      shiftTime.from,
      shiftTime.to,
      this.getTimeRangeByGap(
        shiftTime.from,
        shiftTime.to,
        TimePeriodType.MIN10,
      ),
    );
  }
  /**
   * 当班时间获取按两小时分区的时间区间
   * @param shift 班别
   * @returns
   */
  public getShiftRangeByTwoHour(shift: ShiftModel): TimeRangeModel {
    let shiftTime = this.getShiftRange(shift);
    return new TimeRangeModel(
      shiftTime.from,
      shiftTime.to,
      this.getTimeRangeByGap(
        shiftTime.from,
        shiftTime.to,
        TimePeriodType.HOUR2,
      ),
    );
  }
  /**
   * 获取当前时间所处的班别时间段
   * @param shift 白班开始时间
   * @returns 班别时间段
   */
  public getShiftRange(shift: ShiftModel): TimePeriodModel {
    let now = new Date();
    return this.getFromShift(now.getTime(), shift);
  }

  /**
   * 获取当前时间所处的班别时间段
   * @param shift 白班开始时间
   * @returns 班别时间段
   */
  public getRange(shift: ShiftModel): TimePeriodModel {
    let now = moment({hour: 19, minute: 30, second: 0}).valueOf();
    //return this.getFromShift(now, shift);
    let dayStart = new Date(now);
    dayStart.setHours(shift.hour, shift.min, 0, 0);
    return new TimePeriodModel(dayStart.getTime(), now);
  }

  /**
   * 某个时间段按照某种类型划分时间分区
   * @param from
   * @param to
   * @param gapType
   * @returns
   */
  public getTimeRangeByGap(
    from: number,
    to: number,
    gapType: TimePeriodType,
  ): TimePeriodModel[] {
    let timeGap = this.getGapTime(gapType);
    let result = [];
    while (from < to) {
      if (from + timeGap > to) {
        result.push(new TimePeriodModel(from, to, gapType));
        break;
      } else {
        result.push(new TimePeriodModel(from, from + timeGap, gapType));
        from += timeGap;
      }
    }
    return result;
  }

  /**
   * 根据分区类型获取时间间隔
   * @param gapType
   * @returns
   */
  public getGapTime(gapType: TimePeriodType): number {
    switch (gapType) {
      case TimePeriodType.DAY:
        return 24 * 60 * 60 * 1000;
      case TimePeriodType.SHIFT:
        return 12 * 60 * 60 * 1000;
      case TimePeriodType.HOUR:
        return 60 * 60 * 1000;
      case TimePeriodType.HOUR2:
        return 2 * 60 * 60 * 1000;
      case TimePeriodType.MIN10:
        return 10 * 60 * 1000;
      case TimePeriodType.MIN:
        return 60 * 1000;
      default:
        return 10000000000;
    }
  }

  /**
   * 根据时间戳在当前时区的年月日，转化成0时区后的时间戳
   * @param timestamp 时间戳
   * @returns 0时区的时间戳
   */
  public transferUtc(timestamp: number): number {
    let date = new Date(timestamp);
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * 获取timestamp的当天凌晨0点的时间点
   * 一般用于匹配holiday
   * @param timestamp 时间戳
   * @param shift
   * @returns
   */
  public getDayFrom(timestamp: number, shift: ShiftModel): number {
    let date = new Date(timestamp);
    if (
      date.getHours() < shift.hour ||
      (date.getHours() == shift.hour && date.getMinutes() < shift.min)
    ) {
      date.setDate(date.getDate() - 1);
    }
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }


  /**
   * check 是否是白班
   * @param timestamp：时间戳
   * @returns boolean: 如果是白班，返回true；晚班返回false
   */
  public checkIsDay(timestamp: number, shift: ShiftModel): boolean {
    // 班次持续时长12小时
    let interval = 12 * 60 * 60 * 1000;

    // 将date的日期转换为当天
    let oldDate = moment(timestamp);
    let time = moment({
      hour: oldDate.hours(),
      minute: oldDate.minutes(),
      second: oldDate.seconds(),
    }).valueOf();

    //獲取當前時間
    // 晚班结束早班开始时间
    let standard = moment({
      hour: shift.hour,
      minute: shift.min,
      second: 0,
    }).valueOf();
    // 判断是早班还是晚班
    if (time >= standard && time - standard < interval) {
      // 当前时间 > 当天早上六点四十五且不超过12小时 ，是早班
      return true;
    } else {
      // / 当前时间 < 当天早上六点四十五，是晚班
      return false;
    }
  }

  /**
   * 将数字月份转化成字符串描述，主要用于抓取 DB table pcba_oee15_standard
   * @param month
   * @returns
   */
  getMonthString(month: number): string {
    switch (month) {
      case 1:
        return Constant.MONTH_JAN;
      case 2:
        return Constant.MONTH_FEB;
      case 3:
        return Constant.MONTH_MAR;
      case 4:
        return Constant.MONTH_APR;
      case 5:
        return Constant.MONTH_MAY;
      case 6:
        return Constant.MONTH_JUN;
      case 7:
        return Constant.MONTH_JUL;
      case 8:
        return Constant.MONTH_AUG;
      case 9:
        return Constant.MONTH_SEP;
      case 10:
        return Constant.MONTH_OCT;
      case 11:
        return Constant.MONTH_NOV;
      case 12:
        return Constant.MONTH_DEC;
    }
    return Constant.MONTH_FEB;
  }

  /**
   * 获取某个时间点所处的开班时间
   * @param timestamp 时间点
   * @param shift 白班开班时间
   * @returns
   */
  public getFromShift(timestamp: number, shift: ShiftModel): TimePeriodModel {
    let dayStart = new Date(timestamp);
    dayStart.setHours(shift.hour, shift.min, 0, 0);
    if (this.checkIsDay(timestamp, shift)) {
      return new TimePeriodModel(dayStart.getTime(), timestamp);
    } else {
      if (timestamp < dayStart.getTime()) {
        return new TimePeriodModel(
          dayStart.getTime() - 12 * 60 * 60 * 1000,
          timestamp,
        );
      } else {
        return new TimePeriodModel(
          dayStart.getTime() + 12 * 60 * 60 * 1000,
          timestamp,
        );
      }
    }
  }


  /**
   * 获取某个时间点全年每个月的时间区间，以开班时间计时
   * @param now 时间点
   * @param shift 开班时间
   * @returns
   */
  getMonthByYear(now: number, shift: ShiftModel): TimePeriodModel[] {
    let nowStart = this.getDayFrom(now, shift);
    let year = new Date(nowStart).getFullYear();
    let result: TimePeriodModel[] = [];
    let firstDate = new Date(year, 0, 1, shift.hour, shift.min, 0, 0);
    do {
      let tempDate = new Date(firstDate);
      tempDate.setMonth(tempDate.getMonth() + 1);
      result.push(
        new TimePeriodModel(
          firstDate.getTime(),
          tempDate.getTime(),
          TimePeriodType.MONTH,
        ),
      );
      firstDate = tempDate;
    } while (firstDate.getFullYear() == year);
    return result;
  }
  /**
   * 获取某个时间点前5周的时间区间，以开班时间计时
   * @param now 时间点
   * @param shift 开班时间
   * @returns
   */
  get5Week(now: number, shift: ShiftModel): TimePeriodModel[] {
    let dayEnd = new Date(this.getFromShift(now, shift).from);
    let dayCount = dayEnd.getDay() - 1;
    let year = dayEnd.getFullYear();
    let firstDate = new Date(year, 0, 1, shift.hour, shift.min, 0, 0);
    let count = 5;
    let result: TimePeriodModel[] = [];
    while (count > 0 && dayEnd > firstDate) {
      let dayStart = new Date(
        dayEnd.getTime() - dayCount * Constant.PERIOD_DAY,
      );
      result.unshift(
        new TimePeriodModel(
          dayStart.getTime(),
          dayEnd.getTime(),
          TimePeriodType.WEEK,
        ),
      );
      dayEnd = dayStart;
      dayCount = 7;
      count--;
    }
    if (result[0].from < firstDate.getTime()) {
      result[0].from = firstDate.getTime();
    }
    return result;
  }
  /**
   * 获取某个时间点前7天的时间区间，以开班时间计时
   * @param now 时间点
   * @param shift 开班时间
   * @returns
   */
  get7Day(now: number, shift: ShiftModel): TimePeriodModel[] {
    let dayEnd = new Date(this.getFromShift(now, shift).from);
    let count = 7;
    let year = dayEnd.getFullYear();
    let firstDate = new Date(year, 0, 1, shift.hour, shift.min, 0, 0);
    let result: TimePeriodModel[] = [];
    while (count > 0 && dayEnd > firstDate) {
      let dayStart = new Date(dayEnd.getTime() - Constant.PERIOD_DAY);
      result.unshift(
        new TimePeriodModel(
          dayStart.getTime(),
          dayEnd.getTime(),
          TimePeriodType.DAY,
        ),
      );
      dayEnd = dayStart;
      count--;
    }
    if (result[0].from < firstDate.getTime()) {
      result[0].from = firstDate.getTime();
    }
    return result;
  }

  /**
   * 获取昨天的时间区间，以0点计时
   * @param shift 开班时间
   * @returns
   */
  getYesterdayZeroPeriod(shift: ShiftModel): TimePeriodModel {
    let nowStamp = this.getDayFrom(new Date().getTime(), shift);
    return new TimePeriodModel(nowStamp - Constant.PERIOD_DAY, nowStamp);
  }
  /**
   * 获取昨天的某个班别的时间区间，考虑到开班时间
   * 比如10月18号全班，是10/18 7：30 ~ 10/19 7:30
   * @param shift
   * @param shiftModel
   * @returns
   */
  getYesterdayPeriodByShift(
    shift: string,
    shiftModel: ShiftModel,
  ): TimePeriodModel {
    let period = this.getYesterdayZeroPeriod(shiftModel);
    let dayStart = new Date(period.from);
    dayStart.setHours(shiftModel.hour, shiftModel.min, 0, 0);
    let dayStartTp = dayStart.getTime();
    if (shift == Constant.SHIFT_DAY) {
      return new TimePeriodModel(
        dayStartTp,
        dayStartTp + Constant.PERIOD_SHIFT,
      );
    } else if (shift == Constant.SHIFT_NIGHT) {
      return new TimePeriodModel(
        dayStartTp + Constant.PERIOD_SHIFT,
        dayStartTp + 2 * Constant.PERIOD_SHIFT,
      );
    } else {
      return new TimePeriodModel(
        dayStartTp,
        dayStartTp + 2 * Constant.PERIOD_SHIFT,
      );
    }
  }

  /**
   * 将某个时间段按month/week/day划分区间，以0点作为分开的点
   * @param fromStr
   * @param toStr
   * @param type
   * @returns
   */
  getOeePeriod(
    fromStr: string,
    toStr: string,
    type: string,
    shiftModel: ShiftModel,
  ): TimePeriodModel[] {
    let start = new Date(fromStr + ' 00:00:00');
    start.setHours(shiftModel.hour, shiftModel.min, 0, 0);
    let end = new Date(toStr + ' 00:00:00');
    end.setHours(shiftModel.hour, shiftModel.min, 0, 0);
    end.setDate(end.getDate() + 1);
    return this.getOeePeriodByType(start, end, type as TimePeriodType);
  }

  /**
   * 将某个时间段按month/week/day划分区间
   * 如果按month划分，不足一月的再按week划分
   * 如果按week划分，不足一月的再按day划分
   * @param fromStr
   * @param toStr
   * @param type
   * @returns
   */
  getOeePeriodByType(
    start: Date,
    end: Date,
    type: TimePeriodType,
  ): TimePeriodModel[] {
    let result: TimePeriodModel[] = [];
    let nextDate = this.getPeriodEndByType(start, type);
    while (1) {
      if (nextDate < end) {
        result.push(
          new TimePeriodModel(start.getTime(), nextDate.getTime(), type),
        );
        start = nextDate;
        nextDate = this.getPeriodEndByType(start, type);
      } else if (nextDate.getTime() == end.getTime()) {
        result.push(
          new TimePeriodModel(start.getTime(), nextDate.getTime(), type),
        );
        break;
      } else {
        if (type == TimePeriodType.MONTH) {
          result.push(
            ...this.getOeePeriodByType(start, end, TimePeriodType.WEEK),
          );
          break;
        } else if (type == TimePeriodType.WEEK) {
          result.push(
            ...this.getOeePeriodByType(start, end, TimePeriodType.DAY),
          );
          break;
        } else {
          break;
        }
      }
    }

    return result;
  }
  /**
   * 开始时间的这个Type的结束时间
   * 仅支持MONTH，WEEK，DAY
   * WEEK以周一为开始时间
   * @param start
   * @param type
   */
  getPeriodEndByType(start: Date, type: TimePeriodType): Date {
    let result = new Date(start);
    if (type == TimePeriodType.MONTH) {
      result.setMonth(result.getMonth() + 1);
      result.setDate(1);
    } else if (type == TimePeriodType.WEEK) {
      let day = 8 - result.getDay();
      result.setDate(result.getDate() + day);
    } else {
      result.setDate(result.getDate() + 1);
    }
    return result;
  }
  /**
   * 将前14天的时间按照day进行划分
   * @param shift
   * @returns
   */
  get2WeekByDay(shift: ShiftModel): TimeRangeModel {
    let shiftTime = this.getShiftRange(shift);
    let shiftStartDate = new Date(shiftTime.from);
    let dayStartDate = new Date(
      shiftStartDate.getFullYear(),
      shiftStartDate.getMonth(),
      shiftStartDate.getDate(),
      shift.hour,
      shift.min,
      0,
      0,
    );
    let timeEnd = new Date(dayStartDate).getTime();
    let timeStart = timeEnd - 14 * 24 * 60 * 60 * 1000;
    return new TimeRangeModel(
      timeStart,
      timeEnd,
      this.getTimeRangeByGap(timeStart, timeEnd, TimePeriodType.DAY),
    );
  }

  /**
   * 将某一天24H按照单位小时进行划分
   * @param shift
   * @param day
   * @returns
   */
  get1DayByHour(shift: ShiftModel, day: string): TimeRangeModel {
    let start = new Date(this.getZeroByDay(day));
    start.setHours(shift.hour, shift.min, 0, 0);
    let startTs = start.getTime();
    let endTs = startTs + 24 * 60 * 60 * 1000;
    return new TimeRangeModel(
      startTs,
      endTs,
      this.getTimeRangeByGap(startTs, endTs, TimePeriodType.HOUR),
    );
  }
  /**
   * 获取当月的时间区间
   * @param shift
   * @returns
   */
  getMonthPeriod(shift: ShiftModel): TimePeriodModel {
    let now = new Date();
    let monthFrom = new Date();
    monthFrom.setDate(1);
    monthFrom.setHours(shift.hour, shift.min, 0, 0);
    if (monthFrom.getTime() > now.getTime()) {
      monthFrom.setMonth(monthFrom.getMonth() - 1);
    }
    return new TimePeriodModel(monthFrom.getTime(), now.getTime());
  }
  /**
   * 将YYYY/MM/DD的字符串后面加' 00:00:00'
   * 因为new Date(YYYY/MM/DD)，会是0时区的0点，如果在东8区，这个时间会是YYYY/MM/DD 08:00:00
   * @param day
   * @returns
   */
  getZeroByDay(day: string) {
    return day + ' 00:00:00';
  }

  /**
   * 打印当前时间
   * @returns
   */
  getNowTimeFormat() {
    return moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
  }
  /**
   * 获取某天的某个班别的开始和结束时间
   * @param day
   * @param shift
   * @param shiftModel
   * @returns
   */
  getPeriodByDayShift(
    day: string,
    shift: string,
    shiftModel: ShiftModel,
  ): TimePeriodModel {
    let start = new Date(this.getZeroByDay(day)).setHours(
      shiftModel.hour,
      shiftModel.min,
      0,
      0,
    );
    let end = 0;
    if (shift == Constant.SHIFT_DAY) {
      end = start + Constant.PERIOD_SHIFT;
    } else if (shift == Constant.SHIFT_NIGHT) {
      start = start + Constant.PERIOD_SHIFT;
      end = start + Constant.PERIOD_SHIFT;
    } else {
      end = start + 2 * Constant.PERIOD_SHIFT;
    }
    return new TimePeriodModel(start, end);
  }

  /**
   * 获取一段时间内的某个班别的时间区间详情
   * 比如10/1 ~10/10 白班，就是10个白班区间
   * 如果时10天全班，就是20个period
   * @param starttime
   * @param endtime
   * @param shift
   * @param shiftModel
   * @returns
   */
  getDayByShift(
    starttime: string,
    endtime: string,
    shift: string,
    shiftModel: ShiftModel,
  ): TimeRangeModel {
    let start = new Date(this.getZeroByDay(starttime));
    let startTs = start.setHours(shiftModel.hour, shiftModel.min, 0, 0);
    let end = new Date(this.getZeroByDay(endtime));
    end.setDate(end.getDate() + 1);
    let endTs = end.setHours(shiftModel.hour, shiftModel.min, 0, 0);
    let result = new TimeRangeModel(startTs, endTs, []);
    while (startTs < endTs) {
      if (shift == Constant.SHIFT_DAY) {
        result.range.push(
          new TimePeriodModel(startTs, startTs + Constant.PERIOD_SHIFT),
        );
      } else if (shift == Constant.SHIFT_NIGHT) {
        result.range.push(
          new TimePeriodModel(
            startTs + Constant.PERIOD_SHIFT,
            startTs + 2 * Constant.PERIOD_SHIFT,
          ),
        );
      } else {
        result.range.push(
          new TimePeriodModel(startTs, startTs + Constant.PERIOD_SHIFT),
        );
        result.range.push(
          new TimePeriodModel(
            startTs + Constant.PERIOD_SHIFT,
            startTs + 2 * Constant.PERIOD_SHIFT,
          ),
        );
      }
      startTs += 2 * Constant.PERIOD_SHIFT;
    }
    return result;
  }
  /**
   * 获取每天的某个班别的时间区间详情
   *
   * @param starttime
   * @param endtime
   * @param shift
   * @param shiftModel
   * @returns
   */
  getEveryDaysByShift(
    starttime: string,
    endtime: string,
    shift: string,
    shiftModel: ShiftModel,
  ): TimeRangeModel {
    let start = new Date(this.getZeroByDay(starttime));
    let startTs = start.setHours(shiftModel.hour, shiftModel.min, 0, 0);
    let end = new Date(this.getZeroByDay(endtime));
    end.setDate(end.getDate() + 1);
    let endTs = end.setHours(shiftModel.hour, shiftModel.min, 0, 0);
    let result = new TimeRangeModel(startTs, endTs, []);
    while (startTs < endTs) {
      if (shift == Constant.SHIFT_DAY) {
        result.range.push(
          new TimePeriodModel(startTs, startTs + Constant.PERIOD_SHIFT),
        );
      } else if (shift == Constant.SHIFT_NIGHT) {
        result.range.push(
          new TimePeriodModel(
            startTs + Constant.PERIOD_SHIFT,
            startTs + 2 * Constant.PERIOD_SHIFT,
          ),
        );
      } else {
        result.range.push(
          new TimePeriodModel(startTs, startTs + 2 * Constant.PERIOD_SHIFT),
        );
      }
      startTs += 2 * Constant.PERIOD_SHIFT;
    }
    return result;
  }





  /**
   * 获取昨天的时间间隔
   * @returns TimeRange
   */
  public getYesterdayTimestamp(): AnyObject {
    let now = moment().valueOf();
    let interval = 24 * 60 * 60 * 1000;
    // 晚班结束早班开始时间
    let date = moment({hour: 7, minute: 30, second: 0}).valueOf();
    // **********  update 6.45 */
    // 判断是早班还是晚班
    let start;
    let end;
    if (now > date && now - date < interval) {
      // 当前时间 > 当天早上七点半，差值小于12小时，是早班
      start = date;
      end = moment(date + interval).valueOf();
    } else if (now < date) {
      //  当前时间 < 当天早上七点半  前天晚上18:48 - 当天06.45
      start = moment(date - interval).valueOf();
      end = moment(date).valueOf();
    } else {
      // 大于当天早上七点半 差值大于12小时，是晚班 当天18:45 - 第二天06:45
      start = moment(date + interval).valueOf();
      end = moment(date + interval * 2).valueOf();
    }
    return {start: start, end: end};
  }
  // public getYesterdayTimestamp(): TimePeriodModel {
  //   let end = new Date();
  //   end.setHours(0, 0, 0, 0);
  //   let endTimetamp = end.getTime();
  //   return new TimePeriodModel(endTimetamp - 24 * 60 * 60 * 1000, endTimetamp);
  // }

  /*
   * 以day为间隔，获取时间区间
   * @param startDate 起始时间
   * @param endDate 结束时间
   * @param shift 白班开始时间
   * @returns
   */
  getRangeTimeByShift(
    startDate: string,
    endDate: string,
    shift: ShiftModel,
  ): TimeRangeModel {
    let fromData = new Date(startDate.slice(0, 10) + ' 00:00:00').setHours(
      shift.hour,
      shift.min,
      0,
      0,
    );
    let toData =
      new Date(endDate.slice(0, 10) + ' 00:00:00').setHours(
        shift.hour,
        shift.min,
        0,
        0,
      ) +
      24 * 60 * 60 * 1000;
    let timePeriod = new TimeRangeModel(
      fromData,
      toData,
      this.getTimeRangeByGap(fromData, toData, TimePeriodType.DAY),
    );
    return timePeriod;
  }

  getDateFormat(timestamp: number) {
    let now = new Date(timestamp);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    return year + '-' + this.Add0(month) + '-' + this.Add0(day);
  }
  Add0(num: number): string {
    let stringNumber: string = '';
    if (num < 10) {
      stringNumber = '0' + num;
    } else {
      stringNumber = num.toString();
    }
    return stringNumber;
  }

  public getDayFromShift(
    timestamp: number,
    shift: ShiftModel,
  ): TimePeriodModel {
    let dayStart = new Date(timestamp);
    dayStart.setHours(shift.hour, shift.min, 0, 0);
    if (
      this.checkIsDay(timestamp, shift) ||
      dayStart.getTime() + 12 * 60 * 60 * 1000 <= timestamp
    ) {
      return new TimePeriodModel(
        dayStart.getTime(),
        dayStart.getTime() + 24 * 60 * 60 * 1000,
      );
    } else {
      return new TimePeriodModel(
        dayStart.getTime() - 24 * 60 * 60 * 1000,
        dayStart.getTime(),
      );
    }
  }

  getRangByShift(from: number, to: number) {
    let timePeriod = new TimeRangeModel(
      from,
      to,
      this.getTimeRangeByGap(from, to, TimePeriodType.SHIFT),
    );
    return timePeriod;
  }
  /*
   * 以day为间隔，获取时间区间
   * @param startDate 起始时间
   * @param endDate 结束时间
   * @param shift 白班开始时间
   * @returns
   */
  getRangeTimeByEveryShift(
    startDate: string,
    endDate: string,
    shift: ShiftModel,
  ): TimeRangeModel {
    let fromData = new Date(startDate.slice(0, 10) + ' 00:00:00').setHours(
      shift.hour,
      shift.min,
      0,
      0,
    );
    let toData =
      new Date(endDate.slice(0, 10) + ' 00:00:00').setHours(
        shift.hour,
        shift.min,
        0,
        0,
      ) +
      24 * 60 * 60 * 1000;
    let timePeriod = new TimeRangeModel(
      fromData,
      toData,
      this.getTimeRangeByGap(fromData, toData, TimePeriodType.SHIFT),
    );
    return timePeriod;
  }

  /**
   * 获取 当前日期，班别的 range
   * @param period
   * @param shift
   * @param shiftClass 班别
   * @returns
   */
  getRangeByPeriod(period: string, shift: ShiftModel, shiftClass: string) {
    let from = new Date(period.slice(0, 10)).setHours(shift.hour, shift.min);
    if (shiftClass != null && shiftClass.toLocaleUpperCase() == 'D') {
      return new TimePeriodModel(
        from,
        from + 12 * 60 * 60 * 1000,
        TimePeriodType.SHIFT,
      );
    } else {
      return new TimePeriodModel(
        from + 12 * 60 * 60 * 1000,
        from + 12 * 60 * 60 * 1000 * 2,
        TimePeriodType.SHIFT,
      );
    }
  }

  /**
   * 获取 某一天的range
   * @param period
   * @param shift
   * @param shiftClass 班别
   * @returns
   */
  getDayRangeByPeriod(period: string, shift: ShiftModel) {
    let from = new Date(period.slice(0, 10)).setHours(shift.hour, shift.min);
    return new TimePeriodModel(
      from,
      from + 24 * 60 * 60 * 1000,
      TimePeriodType.DAY,
    );
  }

  /**
   * 按照range切割时间段
   * @param from 起始时间
   * @param to   结束时间
   * @param range 班别range
   * @returns
   */
  division(
    from: number,
    to: number,
    range: TimePeriodModel[],
  ): TimePeriodModel[] {
    let periodTimes = [new TimePeriodModel(from, to, TimePeriodType.SHIFT)];
    range.forEach(item => {
      let temp: TimePeriodModel[] = [];
      periodTimes.forEach(period => {
        let dividePeriods = this.divide(
          period.from,
          period.to,
          item.from,
          item.to,
        );
        temp = temp.concat(dividePeriods);
      });
      periodTimes = temp;
    });

    return periodTimes;
  }

  divide(from: number, to: number, filterFrom: number, filterTo: number) {
    let result: TimePeriodModel[] = [];
    if (from < filterFrom) {
      if (to <= filterFrom) {
        result.push(new TimePeriodModel(from, to, TimePeriodType.SHIFT));
      } else if (to <= filterTo) {
        result.push(
          new TimePeriodModel(from, filterFrom, TimePeriodType.SHIFT),
        );
        result.push(new TimePeriodModel(filterFrom, to, TimePeriodType.SHIFT));
      } else {
        result.push(
          new TimePeriodModel(from, filterFrom, TimePeriodType.SHIFT),
        );
        result.push(
          new TimePeriodModel(filterFrom, filterTo, TimePeriodType.SHIFT),
        );
        result.push(new TimePeriodModel(filterTo, to, TimePeriodType.SHIFT));
      }
    } else if (from < filterTo) {
      if (to <= filterTo) {
        result.push(new TimePeriodModel(from, to, TimePeriodType.SHIFT));
      } else {
        result.push(new TimePeriodModel(from, filterTo, TimePeriodType.SHIFT));
        result.push(new TimePeriodModel(filterTo, to, TimePeriodType.SHIFT));
      }
    } else {
      result.push(new TimePeriodModel(from, to, TimePeriodType.SHIFT));
    }
    return result;
  }

  /**
   * 时间区间转化
   */
  getHistoryRange(from: number, to: number) {
    let dayFrom = new Date(from).setHours(0, 0, 0, 0);
    let dayto = new Date(to).setHours(0, 0, 0, 0);
    return new TimeRangeModel(
      dayFrom,
      dayto,
      this.getTimeRangeByGap(dayFrom, dayto, TimePeriodType.DAY),
    );
  }

  zeroTimeRange(timeRange: TimeRangeModel, shift: ShiftModel): TimeRangeModel {
    let zeroFrom = this.getDayFrom(timeRange.totalFrom, shift);
    let offset = timeRange.totalFrom - zeroFrom;
    return new TimeRangeModel(
      timeRange.totalFrom - offset,
      timeRange.totalTo - offset,
      timeRange.range.map(
        item => new TimePeriodModel(item.from - offset, item.to - offset),
      ),
    );
  }

  ///////////////////
  /**
   * 获取某个时间点的白班开始时间
   * @param timestamp 2021-11-25 12:24:12
   * @param shift
   */
  getDayStartByShift(timestamp: number, shift: ShiftModel): number {
    let dayFrom = this.getDayFrom(timestamp, shift);
    return new Date(dayFrom).setHours(shift.hour, shift.min, 0, 0);
  }

  // 获取某个时间点的白班晚班
  getEveryShiftByTime(
    startTime: string,
    endTime: string,
    shift: ShiftModel,
  ): TimeRangeModel {
    //将字符串转换成时间戳
    let startTimestamp = new Date(startTime).getTime();
    let endTimestamp = new Date(endTime).getTime();
    //11-23  7：30        11-23  7：30
    let start = this.getDayStartByShift(startTimestamp, shift);
    let end = this.getDayStartByShift(endTimestamp, shift);

    let result = new TimeRangeModel(startTimestamp, endTimestamp, []);
    while (start <= end) {
      result.range.push(
        new TimePeriodModel(start, start + Constant.PERIOD_SHIFT),
      );
      result.range.push(
        new TimePeriodModel(
          start + Constant.PERIOD_SHIFT,
          start + 2 * Constant.PERIOD_SHIFT,
        ),
      );
      start += Constant.PERIOD_DAY;
    }
    return result;
  }
  //////////////////

  /**
   * 当班两个班时间获取按小时分区的时间区间,截止到当班时间结束
   * @param shift 班别
   * @returns
   */
  public getTwoShiftRangeByHourLast(shift: ShiftModel): TimeRangeModel {
    let shiftTime = this.getShiftRange(shift);
    return new TimeRangeModel(
      shiftTime.from - 12 * 60 * 60 * 1000,
      shiftTime.from + 12 * 60 * 60 * 1000,
      this.getTimeRangeByGap(
        shiftTime.from - 12 * 60 * 60 * 1000,
        shiftTime.from + 12 * 60 * 60 * 1000,
        TimePeriodType.HOUR,
      ),
    );
  }
}
