
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
import { GeoJson, FeatureCollection } from '../map';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { firebase } from 'firebaseui-angular';

// Init GeoFireX
import * as geofirex from 'geofirex';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

/*
const yourFirebaseConfig = {
  apiKey: "AIzaSyC7KRPdXjqQIhNKhcY_98vrkfQZyU2gHIw",
  authDomain: "neighbor-f6e69.firebaseapp.com",
  databaseURL: "https://neighbor-f6e69.firebaseio.com",
  projectId: "neighbor-f6e69",
  storageBucket: "neighbor-f6e69.appspot.com",
  messagingSenderId: "681260542654"
};

import * as firebase from 'firebase/app';

var app = firebase.initializeApp(yourFirebaseConfig);
*/




export interface Peaches { name: string; }


@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit{

  geo = geofirex.init(firebase)

  latlngtext: any;
  user: any;
  usr: any;
  markerpoint: any;
  hashpoint: any;
  neighborhood: any;
  initHash: any;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  //lat = 37.75;
  //lng = -122.41;
  

  lat = 40.62659207716757;
  lng = -73.96701867575564;
  x = 0;


 db = firebase.firestore();
 findUser = this.db.collection('users');

 //dbuser = firebase.auth().user.uid;
 //dbuser = user.uid

 //userLastSeen = this.db.collection('users').doc('Y3BA83d7AINX008RH0HcEDSVxpw2');

 //userLastSeen = this.db.collection('users').doc(this.dbuser);

  //
  // from angularfirebase and geofirex tutorial
  //
  updateUserLocation(id) {

   // We check last location of user.
   // If most significant six digits of geohash are 
   // different, we delete marker from former
   // neighborhood. 
 
   var ourneighborhood = this.neighborhood;
   var ourgeocollection = this.geo.collection('users');
   var ourmarkerpoint = this.markerpoint;
 
   //var userLastSeen = this.db.collection('users').doc('Y3BA83d7AINX008RH0HcEDSVxpw2');

   // We check last marker location saved in User account
   // to assess whether or not in same neighborhood defined by
   // geohash. If left neighborhood, we delete marker location in 'places'.

   var userLastSeen = this.db.collection('users').doc(this.user.uid);
   //var lastMarkerCollection = this.db.collection('places');

   const userRef = this.user.uid;
   const dbRef = this.db;
 
   // var lastMarkerDocument = this.db.collection('places').doc(this.user.uid);

   userLastSeen.get().then(function(collection2) {
       if (collection2.exists) {
          console.log("Document data:", collection2.data());

          // Get fields from firestore document 
          // through dot notation.
          var geohashlast = collection2.get('position.geohash');
          console.log("Printing geohash:", geohashlast);

          // The most significant five digits from geohash
          // defines our neighborhood.
          var geohashlast_msd = geohashlast.substring(0, 5);


          console.log("Printing old hash from user", geohashlast_msd);
          console.log("Printing new neighborhood", ourneighborhood);

          // If new location is in a different geohash,
          // we delete old location from old neighborhood.
          if (geohashlast_msd != ourneighborhood) {
             // let's console log our results
             console.log('New neighborhood. Delete old location.'); 

             // Let's delete old location in 'places'
             // lastMarkerCollection.doc(geohashlast_msd) 
            
            var lastMarkerDocument = dbRef.collection('places').doc(geohashlast_msd);

/*
            var removePosition = lastMarkerDocument.update({
             Y3BA83d7AINX008RH0HcEDSVxpw2: firebase.firestore.FieldValue.delete()  
                 }).then(function() {
                     console.log("Document successfully deleted!");
                 }).catch(function(error) {
                     console.error("Error removing document: ", error);
                 });
*/
           const executeFirebase = firebase.firestore.FieldValue.delete()

           const integrate: string = "var removePosition = lastMarkerDocument.update({ " + eval('userRef') 
             + ": executeFirebase"   
             + " }).then(function() { "
             +      'console.log("Document successfully deleted!");'
             + " }).catch(function(error) { "
             +      'console.error("Error removing document: ", error);'
             + " });"

           console.log(integrate);
           
           // The Javascript referred to a database field without using quotes. I wanted to refer
           // to Firestore field through a variable reference. That is why this eval scheme was hatched.
           eval(integrate);

          }

          // Now update the user location data.
          const collection = ourgeocollection;
          const lastseen = ourmarkerpoint;
          collection.setDoc(id, {position: lastseen.data});
          console.log("Newest neighborhood", ourmarkerpoint.hash);

       } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
       }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    // we always save last marker location with 
    // User account -- this.user.uid
    // to compare neighborhoods or most significant
    // five digits of geohash.
    // to compare neighborhoods or most significant
    // five digits of geohash.


  }


  // adds location to Firestore using GeoFireX
  addLocation() {

    // Our field name is the Firebase User ID.
    // Every time we click on map, we add new document or overwrite 
    // document based upon field.

    this.createPoint(this.markerpoint.coords[0], this.markerpoint.coords[1], this.user.uid)

  }


  createPoint(thelat, thelng, theuserid) {
    var collection = this.geo.collection('places');

    //const field = 'position'

    // Use the convenience method

   /*
     Rules for marker location changes:
     1) Go to User account to find recent location document
       in collection defined by most significant five digits of geohash.
       Least significant three digits determine unique ID of
       marker in local aggregate.
     2) Delete recent location document, by writing directly to its 
       field, which is the entire geohash.
     3) Store new location document geohash in user account.
  */

    collection.setPoint(this.neighborhood, theuserid, thelat, thelng);

    // Or be a little more explicit
    //const point = this.geo.point(lat, lng)
    //collection.setDoc('my-place', { position: point.data })
  }



  /// default settings

  /// upon login, the default lat/lng info can be drawn from account.
  /// Otherwise, there will be fake information for markers shown
  /// to demonstrate what the application can do


  // data
  source: any;
  markers: any;



  constructor(private mapService: MapService, private router: Router) {
  }


  ngOnInit() {
     
   const toFindUser = this.findUser
   // this.markers = this.mapService.getMarkers(this.neighborhood)
   
   var initHash: string = "";
   var whatMapService = this.mapService
 
    firebase.auth().onAuthStateChanged(function(user) {
         this.usr = user;
         const hashRef: string = "";

         console.log("Who is currentUser? ", this.usr.uid);

         var locationRef = toFindUser.doc(this.usr.uid);

         locationRef.get().then((documentSnapshot) => {
               if (documentSnapshot.exists) {
                 console.log(`Document found with name '${documentSnapshot.id}'`);
 
                 let fieldHash = documentSnapshot.get('position.geohash');
                 console.log(`Retrieved field value: ${fieldHash}`);

                 let hiFieldHash = fieldHash.substring(0, 5);
                 this.hashRef = hiFieldHash;
                 console.log(`Retrieved HASH domain: ${this.hashRef}`);

                 this.markers = whatMapService.getMarkers(this.hashRef);
               };
         }); 

         // this.markers = whatMapService.getMarkers(hashRef); 
         // this.initHash = hashRef;         
    });
 
    //this.markers = this.mapService.getMarkers(initHash);

 
    //var locationLast = this.db.collection('users').doc(this.usr.uid);
    //var lastHash = locationLast.get(position);
    //console.log("This is initial geohash: ", lastHash);

    // var hiLastHash = lastHash.substring(0, 5);
    
 
    this.initializeMap()
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
      });
    }

    this.buildMap()

  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 17,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());


    //// Add Marker on Click
//    this.map.on('click', (event) => {
//      const coordinates = [event.lngLat.lng, event.lngLat.lat]
//      const newMarker   = new GeoJson(coordinates, { message: this.message })
//      this.mapService.createMarker(newMarker)
//    })

    this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat]

      this.markerpoint = this.geo.point(event.lngLat.lat, event.lngLat.lng)
      
      // We need a geohash from user chosen point, markerpoint,
      // to locate neighborhood, called hashpoint. 

      this.hashpoint = this.markerpoint.hash      
      
      // We need to write documents based upon most significant five digits
      // of our hashpoint geohash, with name neighborhood.


      this.neighborhood = this.hashpoint.substring(0, 5) 
      console.log(this.neighborhood + ' this is our neighborhood')

      // login, if not authenticated and click on screen
      this.user = firebase.auth().currentUser
      if (!this.user || this.user.isAnonymous) {
         this.router.navigate([''])
      } else {
      console.log("We NOW have a logged in User!")
      this.latlngtext = JSON.stringify(event.lngLat.wrap())
      console.log(this.latlngtext)


      // Checks neighborhood of new marker.
      // If not in same neighborhood of geohash 
      // with most significant five digits, then
      // delete former location. Otherwise always
      // update User account with new marker
      // location.


      this.updateUserLocation(this.user.uid)


      // adds location to Firestore using GeoFireX
      this.addLocation()

      }
    })


    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {

      /// register source
      this.map.addSource('firebase', {
         type: 'geojson',
         data: {
           type: 'FeatureCollection',
           features: []
         }
      });
      /// This JSON is preamble to JSON in features: array
      /// Contents are from database or whatever source.

      /// get source
      this.source = this.map.getSource('firebase')

      /// subscribe to realtime database and set data source
//      this.markers.subscribe(markers => {
//          let data = new FeatureCollection(markers)
//          this.source.setData(data)
//      })

      /// create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })

    })

  }


  /// Helpers

//  removeMarker(marker) {
//    this.mapService.removeMarker(marker.$key)
//  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }
}
