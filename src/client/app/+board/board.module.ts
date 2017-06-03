// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../+shared/shared.module';

// libs
// import { I18NRouterModule } from '@ngx-i18n-router/core';

// routes & components
import { routes } from './board.routes';
import { BoardComponent } from './board.component';
import { BoardCreateComponent } from './board-create.component';

import { MdButtonModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    // I18NRouterModule.forChild(routes, 'about')
    FormsModule,
    RouterModule.forChild(routes),
    MdButtonModule,
    MdInputModule,
    MdTooltipModule
  ],
  declarations: [
    BoardComponent,
    BoardCreateComponent
  ]
})
export class BoardModule {
}
