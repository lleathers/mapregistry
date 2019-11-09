// import { Component, OnInit } from '@angular/core';

// Added from Raphael Jenni-FirebaseUI-Angular

import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure} from 'firebaseui-angular';
import {Router} from '@angular/router';
import { firebase } from 'firebaseui-angular';


// Init GeoFireX
import * as geofirex from 'geofirex';


// end of import


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

// copy from Raphael Jenni-FirebaseUI-Angular
export class MainComponent implements OnInit {

/*

  geo = geofirex.init(firebase)

  lat = 40.62659207716757;
  lng = -73.96701867575564;
  x = 0;

*/

  //
  // from angularfirebase and geofirex tutorial
  //

/*

  createPoint(lat, lng, field) {
    const collection = this.geo.collection('places')

    //const field = 'position'
  
    // Use the convenience method
    collection.setPoint('my-place', field, lat, lng)

    // Or be a little more explicit
    //const point = this.geo.point(lat, lng)
    //collection.setDoc('my-place', { position: point.data })
  }

  trigger( ) {

    var field='position' + this.x;
    this.createPoint(this.lat, this.lng, field);

    this.x+=1;
    this.x%=4;

    // this.lat+=1;
    this.lng+=0.001;
  }

*/

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => console.log(d));
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    this.router.navigate(['page']);
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  // Logic for dismissing and recovering form for map interaction
  dismissDialogToIcon: boolean = false;
  dismissDialog() { this.dismissDialogToIcon = true; }
  dismissRecoverTab() { this.dismissDialogToIcon = false; }

}

