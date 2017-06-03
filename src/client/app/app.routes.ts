// angular
import { Routes } from '@angular/router';

// libs
import { MetaGuard } from '@ngx-meta/core';

// components
import { ChangeLanguageComponent } from './change-language.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: './+home/home.module#HomeModule'
      },
      {
        path: 'login',
        loadChildren: './+login/login.module#LoginModule'
      },
      {
        path: 'signup',
        loadChildren: './+signup/signup.module#SignupModule'
      },
      {
        path: 'board',
        loadChildren: './+board/board.module#BoardModule'
      },
      {
        path: 'about',
        loadChildren: './+about/about.module#AboutModule'
      }
    ],
    canActivateChild: [MetaGuard],
    data: {
      i18n: {
        isRoot: true
      }
    }
  },
  {
    path: 'change-language/:languageCode',
    component: ChangeLanguageComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
