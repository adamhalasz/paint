// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../+shared/shared.module';

// libs
// import { I18NRouterModule } from '@ngx-i18n-router/core';

// routes & components
import { LoginComponent } from './login.component';
import { MessengerService } from '../+shared/messenger.service';
import { routes } from './login.routes';

import { MdButtonModule } from '@angular/material';
import { MdInputModule } from '@angular/material';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MdButtonModule,
    MdInputModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {
}
