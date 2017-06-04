// angular
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { MessengerService } from '../+shared/messenger.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: string;
  user = {} as any;
  api = 'http://188.166.149.114:9000';

  constructor(
      public http: Http,
      public messenger: MessengerService,
      public router: Router
  ) {
      this.username = '';
      this.password = '';
  }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {}

  login(): void {
    this.http.post(`${this.api}/login`, {
        username: this.username,
        password: this.password
    }, { withCredentials: true }).subscribe(response => {
        console.log('/data response', response);
        const data = response.json();
        if (data.error) {
            this.error = data.error;
        } else {
            this.username = '';
            this.password = '';
            this.messenger.emit('login', data);
            this.router.navigate(['']);
        }
    });
  }
}
