// angular
import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// libs
// import { I18NRouterModule } from '@ngx-i18n-router/core';

// routes & components
import { SignupComponent } from './signup.component';
import { routes } from './signup.routes';

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
  declarations: [SignupComponent]
})
export class SignupModule {
}
