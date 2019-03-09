import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../app/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  appUsers: Observable<User[]>;

  constructor(public afs: AngularFirestore) {
  }
  //
  // getTestcases(): Observable<Testcase[]> {
  //   return this.afs.collection('projects').doc(this.projectId).collection('testCases', ref =>
  //     ref.where('active', '==', true)
  //   ).snapshotChanges().pipe(map(changes => {
  //     return changes.map(a => {
  //       const data = a.payload.doc.data() as Testcase;
  //       data.id = a.payload.doc.id;
  //       return data;
  //     });
  //   }));
  // }
  //
  // addTestcase(testcase: Testcase) {
  //   this.afs.collection('projects').doc(this.projectId).collection('testCases').add(testcase);
  // }
  //
  // getPlatforms(): Observable<Platforms[]> {
  //   return this.afs.collection('projects').doc(this.projectId).collection('platforms').snapshotChanges().pipe(map(changes => {
  //     return changes.map(a => {
  //       const data = a.payload.doc.data() as Platforms;
  //       data.id = a.payload.doc.id;
  //       return data;
  //     });
  //   }));
  // }

  //
  // getOneExecutionTestcase(executionID: string, testcaseID: string) {
  //   return this.afs.collection('projects').doc(this.projectId).
  //   collection('executions').doc(executionID).collection('testCases').doc(testcaseID).get();
  // }

  setUser(userID: string, userData: User) {
    this.afs.collection('Users').doc(userID).set(userData);
  }


}
