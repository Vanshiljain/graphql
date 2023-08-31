import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class IsoDateService {
  constructor() { }

  async checkDate(date: string): Promise<String> {
    const date1 = moment();
    const date2 = moment(date);
    const final = date1.diff(date2, 'week');
    console.log("week----------------" + final);
    let result = ''
    if (final === 1) {
      result = "Date is one day old"
    } else if (final < 7) {
      result = "Date lies within the current week"
    } else if (final >= 7 && final < 14) {
      result = "Date is more than 1 Week old"
    } else if (final >= 14 && final < 21) {
      result = "Date is more than 2 weeks old"
    } else if (final >= 21) {
      result = "Date is more than 3 weeks old"
    }
    return result;
  }
}
