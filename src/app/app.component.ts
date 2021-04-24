import { Component, OnDestroy } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { SharedService } from './shared.service';
import { takeUntil } from 'rxjs/operators'
import { interval } from 'rxjs/internal/observable/interval';
import { timer } from 'rxjs/internal/observable/timer';
import { COLUMNDEF } from './common.contant';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  newMessage: string = '';
  messageList: string[] = [];
  // gridApi: GridApi | undefined;
  countdownTimer: number = 10;
  stats: {cpuUsage?: {system?: number, user?:number},currentTime?: Date } = {};
  columnDefs = COLUMNDEF;
  socketStatus: boolean = false;
  socketStatusObservable:any = '';
  statsObservable: any = '';
  tempObservable: any = '';
  constructor(public sharedService: SharedService) {}
  ngOnDestroy(): void {
    this.socketStatusObservable && this.socketStatusObservable.unsubscribe();
    this.statsObservable && this.statsObservable.unsubscribe();
  }

  onGridReady(params:any) {
    this.sharedService.gridApi = params.api;
    this.sharedService.requestForData();
    //when timer emits after 5s, complete source
    interval(1000).pipe(takeUntil(timer(11000))).subscribe(val => {this.countdownTimer = this.countdownTimer - 1});
  }

  ngOnInit() {
    this.socketStatusObservable = this.sharedService.socketStatus.subscribe(data => this.socketStatus = data);
    this.statsObservable = this.sharedService.status.subscribe(data => {
      this.stats = data;
      this.sharedService
        .getMessages()
        .subscribe((response: any) => {
          // for loading asynchronous data 
          this.sharedService.gridApi?.applyTransactionAsync({ add: response });
        });
    });
    this.tempObservable = this.sharedService
      .getMessages()
      .subscribe((response: any) => {
        // for loading asynchronous data 
        this.sharedService.gridApi?.applyTransactionAsync({ add: response });
      });

      this.sharedService.disconnectSocket();
  }
  

  async getStatsReport(): Promise<any> {
    if(this.socketStatus) {
      this.tempObservable.unsubscribe();
      this.sharedService.getStats();
      
      // response.subscribe(el => this.stats = el);
      // this.sharedService.requestForData('stats');
    }
  }
}