// angular
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, AfterViewInit, SimpleChanges } from '@angular/core';
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
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  board = {} as any;
  socketMessage: string;
  api = 'http://188.166.149.114:9000';


  constructor(
      public http: Http,
      private socket: Socket,
      public activatedRoute: ActivatedRoute,
      public messenger: MessengerService,
      public router: Router) {}

  ngOnDestroy(): void {
    console.log('#Board Destroyed', this.boardId);
    this.socket.emit('leave-board', this.boardId);
    this.boardId = '';
    this.board = {} as any;
  }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: Params) => {
        console.log('#Opened Board',  params['id']);

        if (this.boardId) {
            console.log('#Leave Previous Board', this.boardId);
            this.socket.emit('leave-board', this.boardId);
        }

        

        this.boardId = params['id'];

        console.log('boardId', this.boardId);
        const canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth - 300;
        canvas.height = window.innerHeight - 84;

        /*
        window.onresize = (event: any) => {
            canvas.width = window.innerWidth - 300;
            canvas.height = window.innerHeight - 84;
            //paper.view.requestUpdate();
        };
        */

        var paperScope = new paper.PaperScope();
        paperScope.setup(canvas);
        //console.log('#paper.project', paper.project);


        // Dotted Line Tool
        var dottedLinePath: paperScope.Path;
        var dottedLineTool = new paperScope.Tool();

        dottedLineTool.onMouseDown = (event: any) => {
            new paperScope.Layer().activate();
            dottedLinePath = new paperScope.Path();
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
            console.log('#Draw to Board', params['id'], this.board.title);
            this.socket.emit('draw', {
                boardId: params['id'],
                canvas: paperScope.project.exportJSON()
            });
        };

        this.http.get(`${this.api}/board/${this.boardId}`, { withCredentials: true}).subscribe(response => {
            // console.log('/data response', response);
            const data = response.json();
            this.board = data.board;
            if (this.board.canvas) {
                paperScope.project.importJSON(this.board.canvas);
            }
            // console.log('BOARD DATA', data)
            console.log('#Join New Board', this.boardId);

            this.socket.emit('join-board', this.boardId);
        });

        this.socket.on('message', data => {
            console.log('SOCKET MESSAGE', data);
            this.socketMessage = data;
        });

        this.socket.on('draw-share', data => {
            console.log('draw-share', data);
            // if (data.boardId == this.boardId) {
                paperScope.project.importJSON(data.canvas);
            // }
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
