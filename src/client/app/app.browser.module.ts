// angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// libs
import { BrowserStateTransferModule, DEFAULT_STATE_ID } from '@ngx-universal/state-transfer';
import { CACHE } from '@ngx-cache/core';
import { BrowserCacheModule, MemoryCacheService, STATE_ID } from '@ngx-cache/platform-browser';

// modules & components
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { SocketIoConfig, SocketIoModule } from 'ng2-socket-io';
const socketConfig: SocketIoConfig = { url: 'http://localhost:9000', options: {} };

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'my-app-id'
    }),
    BrowserStateTransferModule.forRoot(),
    BrowserCacheModule.forRoot([
      {
        provide: CACHE,
        useClass: MemoryCacheService
      },
      {
        provide: STATE_ID,
        useValue: DEFAULT_STATE_ID
      }
    ]),
    AppModule,
    SocketIoModule.forRoot(socketConfig)
  ]
})
export class AppBrowserModule {
}
