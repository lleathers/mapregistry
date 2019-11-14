import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { Observable }  from 'rxjs';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';

import { firebase } from 'firebaseui-angular';

@Injectable()
export class MapService {

  constructor(private db: AngularFirestore) {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }



//  getMarkers(): FirebaseListObservable<any> {
//    return this.db.list('/markers')
//  }

//theuserid2: any  

/*
     firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          theuserid2 = user.uid; 
        };
     });
*/

    getMarkers(locale) {
      var documentRef = this.db.collection('places').doc(locale);
//      var documentRef = this.db.collection("places").doc('dr5qv');

//      var documentRef = this.db.doc('places/dr5qv');


     //We are to recover fields from locale neighborhood
     //by querying collection "places".

     var userid: string = "amazing";
     // this.theuserid2 = userid;

/*
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          userid = user.uid
          console.log("from authentication user.uid:", userid) 
          // theuserid2 = user.uid
          //this.testid = user.uid
        }
     });
*/


    async function retrieveField() {

      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            userid = user.uid 
            console.log("from authentication user.uid:", userid) 
            }
          });
    }


    retrieveField().then(() => {

      const thelocale: string  = 
      " documentRef.get().subscribe((documentSnapshot) => {" + 
      "   if (documentSnapshot.exists) {" +
      "     let field = documentSnapshot.get('" + eval('userid') + ".geohash');" +
      "     console.log(`Retrieved neighborhood value:`, field);" +
      "     console.log(`Retrieved the USERID:`, userid);" +
      "   }" +
      " });";

      console.log(thelocale);
      eval(thelocale);
    });



     console.log("LETS TEST UseerID:", userid);
/*
      documentRef.get().subscribe((documentSnapshot) => {
        if (documentSnapshot.exists) {
          let field = documentSnapshot.get('Y3BA83d7AINX008RH0HcEDSVxpw2.geohash')
          console.log(`Retrieved field value: ${field}`);
        }
      });
*/

      ///Retrieving one field based upon one user
      ///We ultimately want to retrieve all fields for all users online

      const testid: string = "`" + eval('userid') + "`"
      console.log("With the EVAL:", testid);
      
/*
      const thelocale: string  = 
      " documentRef.get().subscribe((documentSnapshot) => {" + 
      "   if (documentSnapshot.exists) {" +
      "     let field = documentSnapshot.get('" + eval('testid.uid') + ".geohash');" +
      "     console.log(`Retrieved neighborhood value:`, field);" +
      "     console.log(`Retrieved the USERID:`, userid);" +
      "   }" +
      " });"

      console.log(thelocale);
      eval(thelocale);
*/

/*
      documentRef.get().subscribe((documentSnapshot) => {
        if (documentSnapshot.exists) {
          let field = documentSnapshot.get('Y3BA83d7AINX008RH0HcEDSVxpw2.geohash')
          console.log(`Data: ${JSON.stringify(documentSnapshot.data())}`);
        }
      });
*/

//    ( () => { return documentRef.get()}).subscribe(documentSnapshot => {
//           let field = documentSnapshot.get('Y3BA83d7AINX008RH0HcEDSVxpw2.geohash');
//           console.log(`Retrieved field value: ${field}`);
//           });


//      const documentSnapshot = documentRef.get('Y3BA83d7AINX008RH0HcEDSVxpw2');
//      console.log(`Data: ${JSON.stringify(documentSnapshot)}`);

    }
 

//      documentRef.get().then(documentSnapshot => {
//       let field = documentSnapshot.get('position.geohash');
//       console.log(`Retrieved 


//      var hashtodocument = collectionplaces.doc(locale).onSnapshot(function(doc) {
//                            console.log("Current data: ", doc.data());
//                          });


//      console.log("Current data: ", hashtodocument);
//      }

//        .then(function(doc) {
//           console.log("Current data: ", doc.data());
//      }); 
 

//  createMarker(data: GeoJson) {
//    return this.db.list('/markers')
//                  .push(data)
//  }

//  removeMarker($key: string) {
//    return this.db.object('/markers/' + $key).remove()
//  }

}
