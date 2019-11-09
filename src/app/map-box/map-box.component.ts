
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
  markerpoint: any;
  hashpoint: any;
  neighborhood: any;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  //lat = 37.75;
  //lng = -122.41;
  

  lat = 40.62659207716757;
  lng = -73.96701867575564;
  x = 0;



 db = firebase.firestore();
 usercheck = this.db.collection('users').doc('Y3BA83d7AINX008RH0HcEDSVxpw2');


  message = 'Hello World!';

  //
  // from angularfirebase and geofirex tutorial
  //
  updateUserLocation(id) {
    // we always save last marker location with 
    // User account -- this.user.uid
    // to compare neighborhoods or most significant
    // five digits of geohash.
    // to compare neighborhoods or most significant
    // five digits of geohash.
    const collection = this.geo.collection('users');
    const lastseen = this.markerpoint;
    collection.setDoc(id, {position: lastseen.data});

   // We check last location of user.
   // If most significant six digits of geohash are 
   // different, we delete marker from former
   // neighborhood. 
  
    this.usercheck.get().then(function(doc) {
       if (doc.exists) {
          console.log("Document data:", doc.data());
       } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
       }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  }


 //docRef = this.geo.collection("users").doc("Y3BA83d7AINX008RH0HcEDSVxpw2");
  
 // collectionRef = this.geo.collection("users");

/*

    updateUserLocation(id) {
    // we always save last marker location with 
    // User account -- this.user.uid
    // to compare neighborhoods or most significant
    // five digits of geohash.
    // to compare neighborhoods or most significant
    // five digits of geohash.
    const collection = this.geo.collection('users');
    const lastseen = this.markerpoint;
    collection.setDoc(id, {position: lastseen.data});
  }

*/

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


  trigger() {

    // var field='position' + this.x;

    // Our field name is the Firebase User ID.
    // Every time we click on map, we add new document or overwrite 
    // document based upon field.

    // var field=this.user.uid;

    this.createPoint(this.markerpoint.coords[0], this.markerpoint.coords[1], this.user.uid)

    // this.x+=1;
    // this.x%=4;

    // this.lat+=1;
    // this.lng+=0.001;
  }


  /// default settings

  /// upon login, the default lat/lng info can be drawn from account.
  /// Otherwise, there will be fake information for markers shown
  /// to demonstrate what the application can do



  // data
  source: any;
  markers: any;

  itemDoc: AngularFirestoreDocument<Peaches>;
  item: Observable<Peaches>;

  thecollection = this.geo.collection('users');


  //this.itemDoc = thecollection.data().doc<Peaches>('users/Y3BA83d7AINX008RH0HcEDSVxpw2');  


/*
  this.item = this.itemDoc.valueChanges();

  update(item: Peaches) {
    this.itemDoc.update(item);
  }
*/



  constructor(private mapService: MapService, private router: Router) {
  }




/*
  thecollection = this.geo.collection('users')
  item: Observable<Any> = thecollection.data()
*/  
  




/*
  readUserLocation(id) {
     const collection = this.geo.collection('users')
     var whatis = collection.data().valueChanges()
     console.log("collection.data contents: " + whatis)   

  }
*/


  ngOnInit() {
//    this.markers = this.mapService.getMarkers()
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


      this.user = firebase.auth().currentUser
      if (!this.user || this.user.isAnonymous) {
         this.router.navigate([''])
      } else {
      console.log("We NOW have a logged in User!")
      this.latlngtext = JSON.stringify(event.lngLat.wrap())
      console.log(this.latlngtext)


      //this.readUserLocation(this.user.uid)

      this.updateUserLocation(this.user.uid)

      this.trigger()

      }
    })

         
      
/*
map.on('mousemove', function (e) {
document.getElementById('info').innerHTML =
// e.point is the x, y coordinates of the mousemove event relative
// to the top-left corner of the map
JSON.stringify(e.point) + '<br />' +
// e.lngLat is the longitude, latitude geographical position of the event
JSON.stringify(e.lngLat.wrap());
});
*/


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
