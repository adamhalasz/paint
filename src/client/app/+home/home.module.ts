// angular
import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// libs
// import { I18NRouterModule } from '@ngx-i18n-router/core';

// routes & components
import { routes } from './home.routes';
import { HomeComponent } from './home.component';
import {MdGridListModule} from '@angular/material';



@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    // I18NRouterModule.forChild(routes, 'home')
    RouterModule.forChild(routes),
    MdGridListModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule {
}
