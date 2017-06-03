// angular
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MessengerService } from '../+shared/messenger.service';

@Component({
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  user = {} as any;
  username: string;
  password: string;
  error: string;
  api = 'http://localhost:9000';

  constructor(public http: Http, public messenger: MessengerService) {
      this.username = '';
      this.password = '';
  }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {}

  signup(): void {
    this.http.post(`${this.api}/signup`, {
        username: this.username,
        password: this.password
    }).subscribe(response => {
        console.log('/data response', response);
        const data = response.json();
        if (data.error) {
            this.error = data.error;
        } else {
            this.username = '';
            this.password = '';
            this.messenger.emit('login', data.user);
        }
    });
  }
}
