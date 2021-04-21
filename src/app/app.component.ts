import { Component } from '@angular/core';
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
export class AppComponent {
  newMessage: string = '';
  messageList: string[] = [];
  gridApi: GridApi | undefined;
  countdownTimer: number = 10;
  stats: {cpuUsage?: {system?: number, user?:number},currentTime?: Date } = {};
  columnDefs = COLUMNDEF;
  
  constructor(private sharedService: SharedService) {}

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.sharedService.requestForData();
    //when timer emits after 5s, complete source
    interval(1000).pipe(takeUntil(timer(11000))).subscribe(val => {this.countdownTimer = this.countdownTimer - 1});
  }

  ngOnInit() {
    this.sharedService
      .getMessages()
      .subscribe((response: any) => {
        // for loading asynchronous data 
        this.gridApi?.applyTransactionAsync({ add: response });
      });
  }
  

  async getStatsReport(): Promise<any> {
    let response = await this.sharedService.getStats();
    response.subscribe(el => this.stats = el);
  }
}