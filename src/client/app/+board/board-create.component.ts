// angular
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MessengerService } from '../+shared/messenger.service';

import { Injectable } from '@angular/core';
import { Socket } from 'ng2-socket-io';

@Injectable()
@Component({
  templateUrl: './board-create.component.html'
})
export class BoardCreateComponent implements OnInit {
  title: string;
  error: string;
  api = 'http://188.166.149.114:9000';

  constructor(
      public http: Http,
      private router: Router,
      public messenger: MessengerService,
      private socket: Socket) {}

  ngOnInit(): void {
      this.title = '';
  }

  create(): void {
      this.http.post(`${this.api}/board`, {
          title: this.title
      }, { withCredentials: true }).subscribe(response => {
        const data = response.json();
        console.log('board create data', data);
        if (data.error) {
            this.error = data.error;
        } else {
            this.messenger.emit('boardCreated', data.board);
            this.router.navigate(['board', data.board._id]);
        }
      });
  }
}
