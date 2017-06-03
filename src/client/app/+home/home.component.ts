// angular
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  name: string;
  items: Array<string> = [];
  constructor(public http: Http) {}

  ngOnInit(): void {
    this.http.get('http://localhost:1337/home-data').subscribe(response => {
      console.log('/data response', response);
      const data = response.json();
      this.name = data.name;
      this.items = data.items;
    });
  }
}
