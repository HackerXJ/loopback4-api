import {Provider, ValueOrPromise} from '@loopback/core';
import {cronJob, CronJob} from '@loopback/cron';
import {AnyObject, repository} from '@loopback/repository';
import {PcbaUsersRepository} from '../repositories';
// import {PcbaShiftsRepository} from '../repositories/pcba-shifts.repository';
import {getInitTask} from './corn-status';
@cronJob()
export class TimerControllerJob implements Provider<CronJob> {
  constructor(
    @repository(PcbaUsersRepository)
    public pcbaShiftsRepository: PcbaUsersRepository,
  ) { }
  value(): ValueOrPromise<CronJob> {
    const job = new CronJob({
      name: '定时任务控制器Job', // Name the job
      cronTime: '0 */1 * * * *',
      onTick: async (): Promise<void> => {
        // to do somthing
        const task = getInitTask();
        await this.jobStart(task);
      },
      start: true, // Start the job immediately
    });
    return job;
  }
  async jobStart(task: AnyObject) {
    if (task.pcbaRedColor) {
      console.log("job start");
    }

    // if (task.pcbaPrinter) {

    // }

    // if (task.pcbaReflowFrequency) {

    // }

    // if (task.pcbaReflowTemp) {

    // }
  }
}
