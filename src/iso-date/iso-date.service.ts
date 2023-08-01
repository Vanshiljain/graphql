import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class IsoDateService {
    constructor() { }

    async checkDate(date: string): Promise<String> {
        // check duration between two dates
        // const date1 = new Date(date).moment();
        // const date2 = new Date().getTime();

        const date1 = moment();
        const date2 = moment(date);
        // const diff = date2 - date1;
        const final = date1.diff(date2, 'week');

        // const day = diff/(24*60*60*1000);
        // console.log(day);
        // const final = Math.floor(day);
        
        console.log("week----------------" + final);
        
        let result = ''
        
        if (final === 1) {
            // console.log("Date is one day old");
            result = "Date is one day old"
          } else if (final < 7) {
            // console.log("Date is 1 Week old");
            result = "Date lies within the current week"
          } else if (final >= 7 && final < 14) {
            // console.log("Date is 1 Week old");
            result = "Date is more than 1 Week old"
          } else if (final >= 14 && final < 21) {
            // console.log("Date is 2 weeks old");
            result = "Date is more than 2 weeks old"
          } else if (final >= 21) {
            // console.log("Date is 3 weeks old");
            result = "Date is more than 3 weeks old"
          } 
        //   else {
        //     console.log(Math.floor(final / 7) + " weeks old");
        //   }
        
          return result;
    }
}
