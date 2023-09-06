import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class IsoService {
  constructor() {}

  checkDateAge(IsoDate: string): string {
    const now = moment();
    const date = moment(IsoDate);

    const dayDifference = now.diff(date, 'day');

    console.log('Param 1 ----------> ', now.valueOf());
    console.log('Param 2 ----------> ', date.valueOf());
    console.log('DayDifference -------> ', dayDifference);

    let result = ''
        
    if (dayDifference === 1) {
        // console.log("Date is one day old");
        result = "Date is one day old"
      } else if (dayDifference < 7) {
        // console.log("Date is 1 Week old");
        result = "Date lies within the current week"
      } else if (dayDifference >= 7 && dayDifference < 14) {
        // console.log("Date is 1 Week old");
        result = "Date is more than 1 Week old"
      } else if (dayDifference >= 14 && dayDifference < 21) {
        // console.log("Date is 2 weeks old");
        result = "Date is more than 2 weeks old"
      } else if (dayDifference >= 21) {
        // console.log("Date is 3 weeks old");
        result = "Date is more than 3 weeks old"
      } 
    //   else {
    //     console.log(Math.floor(final / 7) + " weeks old");
    //   }
    
    
      return result;
    }
  }
