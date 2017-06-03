// angular
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { Injectable } from '@angular/core';
import { Socket } from 'ng2-socket-io';
import { MessengerService } from '../+shared/messenger.service';
import * as paper from 'paper';

@Injectable()
@Component({
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  boardId: string;
  board = {} as any;
  socketMessage: string;
  api = 'http://localhost:9000';


  constructor(
      public http: Http,
      private socket: Socket,
      public activatedRoute: ActivatedRoute,
      public messenger: MessengerService,
      public router: Router) {}

  ngOnInit(): void {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.boardId = params['id'];

        console.log('boardId', this.boardId);
        const canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth - 300;
        canvas.height = window.innerHeight - 84;

        paper.setup(canvas);
        console.log('#paper.project', paper.project);

        // Dotted Line Tool
        var dottedLinePath: paper.Path;
        var dottedLineTool = new paper.Tool();

        dottedLineTool.onMouseDown = (event: any) => {
            new paper.Layer().activate();
            dottedLinePath = new paper.Path();
            dottedLinePath.strokeColor = '#3080ff';
            dottedLinePath.strokeWidth = 2;
            // dottedLinePath.dashArray = [5, 8];
            dottedLinePath.strokeCap = 'round';
            dottedLinePath.strokeJoin = 'round';
            dottedLinePath.add(event.point);
        };

        dottedLineTool.onMouseDrag = (event: any) => {
            dottedLinePath.add(event.point);
        };

        dottedLineTool.onMouseUp = (event: any) => {
            dottedLinePath.smooth();
            dottedLinePath.simplify();
            this.socket.emit('draw', {
                boardId: this.boardId,
                canvas: paper.project.exportJSON()
            });
        };

        this.http.get(`${this.api}/board/${this.boardId}`, { withCredentials: true}).subscribe(response => {
            // console.log('/data response', response);
            const data = response.json();
            this.board = data.board;
            if (this.board.canvas) {
                paper.project.importJSON(this.board.canvas);
            }
            console.log('BOARD DATA', data)
        });

        this.socket.on('message', data => {
            console.log('SOCKET MESSAGE', data);
            this.socketMessage = data;
        });

      });
  }

  delete(): void {
      this.http.delete(`${this.api}/board/${this.boardId}`, { withCredentials: true}).subscribe(response => {
        // console.log('/data response', response);
        const data = response.json();
        this.messenger.emit('boardDeleted', this.boardId);
        console.log('BOARD DELETE DATA', data)
        this.router.navigate(['']);
    });
  }

}
