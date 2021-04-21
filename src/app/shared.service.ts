import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.prod';
import { EVENTLIST } from './common.contant';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  socketStatus = new BehaviorSubject(false);
  constructor(private socket: Socket, private httpService: HttpClient) { 
    this.socket.on(EVENTLIST.CONNECT_STATUS, (status: any) => {
      this.socketStatus.next(status);
    });
  }
  

  public requestForData() {
    this.socket.emit(EVENTLIST.REQUEST_FOR_NEW_DATA);
  }
  
  public getMessages = () => {
    return new Observable((obsr:any) => {
      this.socket.on(EVENTLIST.INCOMING_DATA, (response: any) => {
        obsr.next(response);
      });
    });
  }

  public getStats(): Observable<any> {
    return this.httpService.get(environment.nodeUrl +`api/get-stats`);
  }

  public disconnectSocket() {
    setTimeout(() => {
      this.socket.emit(EVENTLIST.DISCONNECT_SOC, false)
    }, 120000)
  }
}
