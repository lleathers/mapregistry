import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';



const yourFirebaseConfig = {
  apiKey: "AIzaSyC7KRPdXjqQIhNKhcY_98vrkfQZyU2gHIw",
  authDomain: "neighbor-f6e69.firebaseapp.com",
  databaseURL: "https://neighbor-f6e69.firebaseio.com",
  projectId: "neighbor-f6e69",
  storageBucket: "neighbor-f6e69.appspot.com",
  messagingSenderId: "681260542654"
};


import * as firebase from 'firebase/app';
firebase.initializeApp(yourFirebaseConfig);

//var app = firebase.initializeApp(yourFirebaseConfig);


// Init GeoFireX
import * as geofirex from 'geofirex';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Emergency Crowdsourced Supermarkets';
  items: Observable<any[]>;
  points: Observable<any[]>;


  geo = geofirex.init(firebase);

  lat = 38;
  lng = -19;
  x = 0;

  //
  // from angularfirebase and geofirex tutorial
  //
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

    var field='position' + this.x
    this.createPoint(this.lat, this.lng, field);

    this.x+=1;
    this.x%=4;

    // this.lat+=1;
    this.lng+=1;  
  }




onSignIn(googleUser) {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!this.isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
}


isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}


  // Logic for dismissing and recovering form for map interaction
  dismissDialogToIcon: boolean = false;
  dismissDialog() { this.dismissDialogToIcon = true; }
  dismissRecoverTab() { this.dismissDialogToIcon = false; }





}
