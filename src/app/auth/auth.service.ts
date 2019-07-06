import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public logged: BehaviorSubject<boolean>;

  constructor(private router: Router) {
    this.logged = new BehaviorSubject<boolean>(false);
  }

  public isAuthenticated(): Observable<boolean> {
    return from(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.logged.next(true);
          return true;
        }),
        catchError(error => {
          this.logged.next(false);
          return of(false);
        })
      );
  }

  public signOut() {
    from(Auth.signOut())
      .subscribe(
        result => {
          this.logged.next(false);
          this.router.navigate(['/login']);
        },
        error => console.log(error)
      );
  }
}
