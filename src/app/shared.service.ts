import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.prod';
import { EVENTLIST } from './common.contant';
import { BehaviorSubject } from 'rxjs';
import { GridApi } from 'ag-grid-community';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  gridApi: GridApi | undefined;
  socketStatus = new BehaviorSubject(false);
  status = new BehaviorSubject({});
  constructor(private socket: Socket, private httpService: HttpClient) { 
    this.socket.on(EVENTLIST.CONNECT_STATUS, (status: any) => {
      this.socketStatus.next(status);
    });

    this.socket.on('stats', (data: any) => {
      this.status.next(data);
      this.socket.emit(EVENTLIST.REQUEST_FOR_NEW_DATA, this.gridApi?.getDisplayedRowCount());
    });
  }
  

  public requestForData(purpose?:any) {
    this.socket.emit(EVENTLIST.REQUEST_FOR_NEW_DATA, purpose);
  }
  
  public getMessages = () => {
    return new Observable((obsr:any) => {
      this.socket.on(EVENTLIST.INCOMING_DATA, (response: any) => {
        setTimeout(() => {
          obsr.next(response);
          
        },10)
        
        
      });
    });
  }

  public getStats(): any {
    // return this.httpService.get(environment.nodeUrl +`api/get-stats`);
    setTimeout(() => {
      this.socket.emit('test');
    })
    
  }

  public disconnectSocket() {
    setTimeout(() => {
      this.socket.emit(EVENTLIST.DISCONNECT_SOC, false)
    }, 120000)
  }
}
