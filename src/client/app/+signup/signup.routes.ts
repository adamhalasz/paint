// angular
import { Routes } from '@angular/router';

// components
import { SignupComponent } from './signup.component';

export const routes: Routes = [
  {
    path: '',
    component: SignupComponent,
    data: {
      meta: {
        title: 'Signup Page',
        override: true,
        description: 'Create a new account to Drawer'
      }
    }
  }
];
