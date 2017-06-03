// angular
import { Routes } from '@angular/router';

// components
import { LoginComponent } from './login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      meta: {
        title: 'Login Page',
        override: true,
        description: 'Login to Drawer'
      }
    }
  }
];
