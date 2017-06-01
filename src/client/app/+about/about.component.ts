// angular
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  fruits: Array<string> = [];
  constructor(public http: Http) {}

  ngOnInit(): void {
      this.http.get('http://localhost:8000/data').subscribe(response => {
        // console.log('/data response', response);
        const data = response.json();
        this.fruits = data.fruits;
    });
  }
}
