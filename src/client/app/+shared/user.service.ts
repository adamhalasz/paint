import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import { MessengerService } from './messenger.service';
import { Http } from '@angular/http';

@Injectable()
export class UserService {

  id: string;
  username: string;
  loggedIn = false;
  boards: Array<any>;
  api = 'http://188.166.149.114:9000';

  constructor(public http: Http, public messenger: MessengerService) {
    console.log('SUBSCRIBE to LOGIN...');
    this.messenger.login.subscribe(data => {
      console.log('Successful Login:', data);
      this.id = data.user._id;
      this.username = data.user.username;
      this.boards = data.boards;
      this.loggedIn = true;
    });

    this.messenger.boardCreated.subscribe(board => {
        this.boards.push(board);
    });

    this.messenger.boardDeleted.subscribe(boardId => {
        console.log('MESSENGER boardDeleted -> boardId', boardId);
        const boardIndex = this.boards.findIndex(board => {
            return board._id === boardId;
        });
        console.log('MESSENGER boardDeleted -> boardIndex', boardIndex);
        this.boards.splice(boardIndex, 1);
    });
  }

  logout(): void {
    this.http.post(`${this.api}/logout`, {}, { withCredentials: true }).subscribe(data => {
        console.log(`${this.api}/logout -> data`, data);
        this.id = undefined;
        this.username = undefined;
        this.loggedIn = false;
        this.messenger.emit('logout');
    });
  }

  authorize(): void {
      if (!this.loggedIn) {
        this.http.get(`${this.api}/authorize`, { withCredentials: true }).subscribe(response => {
            const data = response.json();
            console.log(`${this.api}/authorize -> data`, data);
            if (data.ok) {
                this.id = data.user._id;
                this.username = data.user.username;
                this.boards = data.boards;
                this.loggedIn = true;
            }
        })
      }
  }

}


