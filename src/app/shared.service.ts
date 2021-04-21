import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.prod';
import { EVENTLIST } from './common.contant';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private socket: Socket, private httpService: HttpClient) { }


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
}
