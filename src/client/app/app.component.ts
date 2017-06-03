// angular
import { Component, OnInit } from '@angular/core';

// libs
import { ConfigService } from '@ngx-config/core';
import { MetaService } from '@ngx-meta/core';
// import { I18NRouterService } from '@ngx-i18n-router/core';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
// external styles
import '../assets/sass/layout.scss';

import { Injectable } from '@angular/core';
import { Socket } from 'ng2-socket-io';

import { MessengerService } from './+shared/messenger.service';
import { UserService } from './+shared/user.service';

@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string;
  name: string;
  fruits: Array<string> = [];
  socketMessage: string;

  constructor(private readonly config: ConfigService,
              private readonly translate: TranslateService,
              private readonly meta: MetaService,
              public http: Http,
              private socket: Socket,

              // User Service Needs to be initialized
              // in order to listen for login events
              public user: UserService,
              public messenger: MessengerService) { // ,
              // private readonly i18nRouter: I18NRouterService) {
  }

  ngOnInit(): void {
    this.title = 'ng-seed (universal) works!';
    this.socketMessage = '_EMPTY_SOCKET_MESSAGE_';
    const defaultLanguage = this.config.getSettings('i18n.defaultLanguage');

    // add available languages & set default language
    this.translate.addLangs(this.config.getSettings('i18n.availableLanguages')
      .map((language: any) => language.code));
    this.translate.setDefaultLang(defaultLanguage.code);

    this.meta.setTag('og:locale', defaultLanguage.culture);

    // this.i18nRouter.init();

    this.setLanguage(defaultLanguage);

    this.user.authorize();
/*
    this.socket.on('message', data => {
      console.log('SOCKET MESSAGE', data);
      this.socketMessage = data;
    });
*/
  }

  sendMessage(): void {
    this.socket.emit('message', '_#Yaay_');
  }

  private setLanguage(language: any): void {
    this.translate.use(language.code).subscribe(() => {
      this.meta.setTag('og:locale', language.culture);
    });

    // this.i18nRouter.changeLanguage(language.code);
  }
}
