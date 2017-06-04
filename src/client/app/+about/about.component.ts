// angular
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { Injectable } from '@angular/core';
import { Socket } from 'ng2-socket-io';

@Injectable()
@Component({
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  fruits: Array<string> = [];
  socketMessage: string;
  constructor(public http: Http, private socket: Socket) {}

  ngOnInit(): void {
      this.http.get('http://localhost:1337/data').subscribe((response: any) => {
        // console.log('/data response', response);
        const data = response.json();
        this.fruits = data.fruits;
      });

      this.socket.on('message', (data: any) => {
        console.log('SOCKET MESSAGE', data);
        this.socketMessage += data;
      });

  }

  emit(): void {
      this.socket.emit('message', new Date().toUTCString())
    }
}
