// angular
import { ChangeDetectionStrategy, Component,  OnInit, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {
  name: string;
  boards: Array<string> = [];
  users: Array<string> = [];
  api = 'http://188.166.149.114:9000';
  constructor(public http: Http) {}

  ngOnInit(): void {
    this.http.get(this.api).subscribe(response => {
      console.log('/data response', response);
      const data = response.json();
      this.users = data.users;
      this.boards = data.boards;
    });
  }
}
