import {Injectable, NgZone} from '@angular/core';

import * as firebase from 'firebase/app';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class AuthService {

  user: User = null;
  observableUser: Observable<User> = null;

  constructor(private auth: AngularFireAuth,
              private router: Router,
              public zone: NgZone) {

    this.observableUser = auth.authState;
    auth.authState.subscribe((user) => {
      this.user = user;
    });


  }



  isAuthenticated(): Boolean {
    return this.user !== null;
  }

  getUser(): User {
    return this.isAuthenticated() ? this.user : null;
  }

  signInWithGoogle() {
    return this.auth.auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
    );
  }

  logout() {

    this.auth.auth.signOut()
        .then((res) => {
          this.zone.run(() => {
            this.router.navigate(['/login'], { replaceUrl: true });
          });
        });
  }
}
