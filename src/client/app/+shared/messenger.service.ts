import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessengerService {

  // Login
  loginSubject = new Subject<any>();
  logoutSubject = new Subject<any>();
  boardCreatedSubject = new Subject<any>();
  boardDeletedSubject = new Subject<any>();

  // tslint:disable-next-line:member-ordering
  login = this.loginSubject.asObservable();

  // tslint:disable-next-line:member-ordering
  logout = this.logoutSubject.asObservable();

  // tslint:disable-next-line:member-ordering
  boardCreated = this.boardCreatedSubject.asObservable();

  // tslint:disable-next-line:member-ordering
  boardDeleted = this.boardDeletedSubject.asObservable();

  emit(listenerName: string, data?: any): void {
      console.log('MESSENGER:EMIT->', `${listenerName}Subject`);
      if (this[`${listenerName}Subject`]) {
        this[`${listenerName}Subject`].next(data);
      } else {
        console.error(`MessengerService.emit: Subject not found for Listener Name ${listenerName}.`);
      }
  }
}
