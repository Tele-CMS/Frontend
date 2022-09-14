import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';


@Component({
    selector: 'app-count-down',
    templateUrl: './count-down.component.html',
    styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit, OnDestroy {

    @Input() inputDate : Date;
    @Input() heading : string;

    private subscription: Subscription;

    public dateNow = new Date();
    milliSecondsInASecond = 1000;
    hoursInADay = 24;
    minutesInAnHour = 60;
    SecondsInAMinute = 60;

    public timeDifference;
    public secondsToDday:number;
    public minutesToDday:number;
    public hoursToDday:number;
    public daysToDday:number;
    dd: Date;


    constructor() {
        let date = new Date();
        date.setHours(date.getHours() +2 );
        this.dd  = date;

    }
    ngOnInit() {
        this.subscription = interval(1000)
            .subscribe(x => { this.getTimeDifference(); });
    }
    private getTimeDifference() {
       
        this.timeDifference = this.dd.getTime() - new Date().getTime();
       // this.timeDifference = new Date(this.inputDate).getTime() - new Date().getTime();
        this.allocateTimeUnits(this.timeDifference);
    }

    private allocateTimeUnits(timeDifference) {
        this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
        this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
        this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
        this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    }

    get isShowDays():boolean{
        return (this.daysToDday > 0)  ? true : false;
    }

    get isShowHours():boolean{
        return (this.isShowDays || this.hoursToDday > 0) ? true : false;
    }

    get isShowMints():boolean{
        return (this.isShowHours || this.minutesToDday > 0) ? true : false;
    }

    get isShowSeconds():boolean{
        return (this.isShowMints || this.secondsToDday > 0) ? true : false;
    }
  

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }




}
