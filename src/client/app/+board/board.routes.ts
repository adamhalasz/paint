// angular
import { Routes } from '@angular/router';

// components
import { BoardComponent } from './board.component';
import { BoardCreateComponent } from './board-create.component';

export const routes: Routes = [
  {
    path: 'create',
    component: BoardCreateComponent,
    data: {
      meta: {
        title: 'Create New Board',
        description: 'Create new board description.'
      }
    }
  },
  {
    path: ':id',
    component: BoardComponent,
    data: {
      meta: {
        title: 'Board',
        description: 'Default Board Description'
      }
    }
  }
];
