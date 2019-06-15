import {Component, NgZone, ViewChild, ElementRef, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController, App, Events, IonicPage, LoadingController,
  NavController, NavParams, Platform, ToastController
} from 'ionic-angular';
import {Geolocation, GeolocationOptions, Geoposition} from '@ionic-native/geolocation';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';

import {DeviceOrientation, DeviceOrientationCompassHeading} from "@ionic-native/device-orientation";


import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions} from "@ionic-native/device-motion";

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'map.html',
})
export class MapPage implements OnInit{

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;

  addressElement: HTMLInputElement = null;

  // arrayOfInterests: string[] = ["airport","bank","book_store","bus_station","cafe",
  //   "gas_station","gym","hospital", "library",
  //   "museum","parking","pharmacy","police",
  //   "restaurant","shopping_mall","supermarket",
  //   "subway_station","taxi_stand","train_station","zoo"];

  arrayOfInterests: string[] = ["cafe","restaurant"];


  private originPlaceId: HTMLInputElement = null;
  private destinationPlaceId: HTMLInputElement = null;


  compas = true;


  map: any;
  marker: any;
  placemarker: any;
  markers: any = [];
  loading: any;
  search: boolean = false;
  error: any;
  switch: string = "map";
  target = false;
  navigating = false;

  proba: any;

  private currentLat: any;
  private currentLong: any;

  isTracking: boolean = false;

  private isType: any = "";
  private isKM = 5;
  private x: any;
  private y: any;
  private z: any;
  private timestamp: number;
  private orientation: any;

  private placesArray: any = [];
  private locationOfMe: any;

  directionsService: any;
  directionsDisplay: any;

  private starttrackingButton: any;

  private addInterest: String;


  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public app: App,
    public zone: NgZone,
    public platform: Platform,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public gyroscope: Gyroscope,
    public events:Events
  ) {
    this.platform.ready().then(() => this.loadMaps());

  }

  ngOnInit(): void
  {
  }



  startNavigating(){

    if(this.originPlaceId)
    {
      this.navigating = true;
      console.log("222")
      console.log(this.originPlaceId)
    }

    this.search = false;
    this.removeMarkers();
    this.markers.pop();

    console.log(this.markers);

    if(this.directionsDisplay)
    {
      this.directionsDisplay.setMap(null);
      this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));
    }

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    this.directionsService.route({
      origin:  {lat: this.x.coords.latitude, lng: this.x.coords.longitude},
      destination: {lat: this.y.lat(), lng: this.y.lng()},
      travelMode: google.maps.TravelMode['WALKING']
    }, (res, status) => {

      if(status == google.maps.DirectionsStatus.OK){
        this.directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }

    });

    this.compas = false;

  }


  nearbyPlace(place){


    if(this.addInterest != null)
    {
      this.placesArray = [];
      let service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
        location: this.locationOfMe,
        radius: 8047,
        types: [place]
      }, (results, status) => {
        this.callback(results, status);
      });
    }

  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.placesArray.push(results[i]);
      }
    }

    console.log(this.placesArray);
      this.switch = 'list';
  }


  removeMarkers(){
    for(let i = 1; i < this.markers.length; i++){
      this.markers[i].setMap(null);
    }
  }

  trackMe() {
    if (navigator.geolocation) {
      this.isTracking = true;


      let options = {
        frequency: 3000,
        enableHighAccuracy: false
      };


      navigator.geolocation.watchPosition((position) => {

        this.showTrackingPosition(position);
      });


    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }


  showTrackingPosition(position) {

    // if(this.x.coords !== undefined &&
    //   this.y.lat() != 0 && this.x.coords !== undefined &&
    //   this.y.lng() != 0)
    // {
    //
    // if(this.x.coords.latitude == this.y.lat() && this.x.coords.longitude == this.y.lng())
    // {
    //
    //   this.starttrackingButton = true;
    //   this.compas = true;
    //   this.addInfoWindow(this.placemarker,"You are there");
    //
    // }
    //
    // }

    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    this.x = position;
    this.locationOfMe = location;


    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Got you!',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5.5,
          fillColor: "#48d7d8",
          fillOpacity: 0.4,
          strokeWeight: 0.4
        }
      });

      this.markers.push(this.marker)
    }
    else {

      this.markers.push(this.marker)
      this.marker.setPosition(location);
      this.markers.pop()

    }


  }


  loadMaps() {
    if (!!google) {
      this.initializeMap();
      this.initAutocomplete();
      // this.nearbyPlace();
    } else {
      this.errorAlert('Error', 'Something went wrong with the Internet Connection. Please check your Internet.')
    }
  }

  errorAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.loadMaps();
          }
        }
      ]
    });
    alert.present();
  }


  initAutocomplete(): void {

    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');

    this.createAutocomplete(this.addressElement).subscribe((location) => {
      console.log('Searchdata', location);
      let options = {
        center: location,
        zoom: 10
      };
      this.map.setOptions(options);
      console.log("BURGER KING");
      console.log(this.placesArray)

      this.addPlaceMarker(location, "Mein gesuchter Standort");

      // this.map;

      this.starttrackingButton = true;
    });



  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
          //todo : ovdje mi se mogao ubaciti kakav prozorcic pendzercic da javlja stogod
          //   sub.error({
          //     message: 'Autocomplete returned place with no geometry moooo'
          //      pored toga trebalo bi i rijesiti ono sa locationom
          // });
        } else {
          sub.next(place.geometry.location);
          this.y = place.geometry.location;
          console.log(this.y.lat())
        }
      });
    });
  }


  initializeMap() {
    this.zone.run(() => {
      var mapEle = this.mapElement.nativeElement;
      this.map = new google.maps.Map(mapEle, {
        zoom: 10,
        center: { lat: 51.165691, lng: 10.451526 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      });
      this.trackMe();

      google.maps.event.addListener(this.map, 'bounds_changed', () => {
        this.zone.run(() => {
          this.resizeMap();
        });
      });


    });
  }



  resizeMap() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 200);
  }

  showToastmessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  // go show currrent location
  getCurrentPosition() {
    this.loading = this.loadingCtrl.create({
      content: 'Searching Location ...'
    });
    this.loading.present();

    let locationOptions = { timeout: 10000, enableHighAccuracy: true };

    this.geolocation.getCurrentPosition(locationOptions).then(
      (position) => {
        this.loading.dismiss().then(() => {

          this.showToastmessage('Location found!');

          console.log(position.coords.latitude, position.coords.longitude);
          let myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          let options = {
            center: myPos,
            zoom: 14
          };
          this.map.setOptions(options);
          this.addMarker(myPos, "Mein Standort!");
        });
      },
      (error) => {
        this.loading.dismiss().then(() => {
          this.showToastmessage('Location not found. Please enable your GPS!');

          console.log(error);
        });
      }
    )
  }

  toggleSearch() {
    if (this.search) {
      this.search = false;
      // this.target = false;
    } else {
      this.search = true;
    }
  }

  toggleTracked() {
    if (this.starttrackingButton) {
      this.starttrackingButton = false;
      // this.target = false;
    } else {
      this.starttrackingButton = true;
    }
  }



  addMarker(position, content) {
    let marker = new google.maps.Marker({
      map: this.map,
      position: position,
      icon: {
        path: google.maps.SymbolPath,
        scale: 5.5,
        fillColor: "#48d7d8",
        fillOpacity: 0.4,
        strokeWeight: 0.4
      }
    });

    this.addInfoWindow(marker, content);
    return marker;
  }

  addPlaceMarker(position, content) {

    if(this.placemarker)
    {
      this.markers;
      this.placemarker.setMap(null);
    }

    this.placemarker = new google.maps.Marker({
      map: this.map,
      position: position
    });


    this.markers.push(this.placemarker);

    this.map.setZoom(20);
    this.map.panTo(this.placemarker.position);

    this.addInfoWindow(this.placemarker, content);

    console.log(this.markers);

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markers.length; i++) {
      bounds.extend(this.markers[i].getPosition());
    }

    this.map.fitBounds(bounds);

    return this.placemarker;


  }


  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }



  fun(position)
  {
    this.switch = "map";
    this.y = position.geometry.location;
    this.addPlaceMarker(this.y,"To");
    this.starttrackingButton = true;
  }



}
