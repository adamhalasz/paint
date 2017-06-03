// angular
import { Routes } from '@angular/router';

// components
import { AboutComponent } from './about.component';

export const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    data: {
      meta: {
        title: 'PUBLIC.ABOUT.PAGE_TITLE',
        description: 'PUBLIC.ABOUT.META_DESCRIPTION'
      }
    }
  }
];
