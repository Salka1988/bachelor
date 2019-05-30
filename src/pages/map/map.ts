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

  listSearch: string = '';

  arrayOfInterests: string[] = ["airport","bank","book_store","bus_station","cafe",
    "gas_station","gym","hospital", "library",
    "museum","parking","pharmacy","police",
    "restaurant","shopping_mall","supermarket",
    "subway_station","taxi_stand","train_station","zoo"];

  private originPlaceId: HTMLInputElement = null;
  private destinationPlaceId: HTMLInputElement = null;

  private travelMode: string;

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

  desOfPlace: any;

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

//todo: Add location at th


  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public app: App,
    public nav: NavController,
    public zone: NgZone,
    public platform: Platform,
    public alertCtrl: AlertController,
    public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public geolocation: Geolocation,
    public deviceMotion: DeviceMotion,
    public gyroscope: Gyroscope,
    public deviceOrientation: DeviceOrientation,
    public navParams: NavParams,
    public events:Events
  ) {
    this.platform.ready().then(() => this.loadMaps());
  }



  // ionViewDidLoad(){
  // }



  ngOnInit() {
    // this.listenEvents();
    // this.platform.ready().then(() => this.loadMaps());
    // this.desOfPlace = this.navParams.get('place');
  }


  startNavigating(){

    //todo: ispitati dali je sve ok u lat i lng
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


  nearbyPlace(){

    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: this.locationOfMe,
      radius: 8047,
      types: ["cafe|restaurant|museum"]
    }, (results, status) => {
      this.callback(results, status);
    });
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.placesArray.push(results[i]);
      }
    }
  }

  loog()
  {
    console.log("mo");
  }

  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
      });
    } else {
      alert("Geolocation i  s not supported by this browser.");
    }
  }


  removeMarkers(){
    for(let i = 1; i < this.markers.length; i++){
      this.markers[i].setMap(null);
    }
  }

  trackMe() {
    if (navigator.geolocation) {
      // if (this.geolocation) {
      this.isTracking = true;


      let options = {
        frequency: 3000,
        enableHighAccuracy: false
      };

      // this.geolocation.watchPosition(options).subscribe( position  => {
      //   this.currentLat = position.coords.latitude;
      //   this.currentLong = position.coords.longitude;
      //   this.showTrackingPosition();
      // });


      // this.platform.ready().then(() => {
      //   var subscription = this.deviceOrientation.watchHeading({frequency:1000}).subscribe(
      //     (data: DeviceOrientationCompassHeading) => {
      //       this.orientation = parseInt(data.magneticHeading.toFixed(0));
      //
      //     })
      // });

      navigator.geolocation.watchPosition((position) => {

        this.showTrackingPosition(position);
      });


    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    // this.currentLat = position.coords.latitude;
    // this.currentLong = position.coords.longitude;

    if(!position)
    {
      console.log("dobar");
    }

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    ///POKUSATI SA LOKALNIM MARKEROM
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

      // this.markers.push(this.marker)
    }
    else {
      this.marker.setPosition(location);
    }
  }


  showTrackingPosition(position) {

    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;


    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    console.log("TU JE !!!")

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
          // rotation: 20
        }
      });

      this.markers.push(this.marker)
      // this.marker.icon.rotation = 120;
      this.nearbyPlace();
    }
    else {

      //todo provjeriti koliko se puta ponavlja ovaj marker i dali moze ovako
      this.markers.push(this.marker)
      this.marker.setPosition(location);
      this.nearbyPlace();
      this.markers.pop()

      // this.marker.icon.rotation = parseInt(Math.random().toFixed(0));

    }


  }

  viewPlace(id) {
    console.log('Clicked Marker', id);
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

  // mapsSearchBar(ev: any) {
  //   // set input to the value of the searchbar
  //   // this.search = ev.target.value;
  //   console.log(ev);
  //   const autocomplete = new google.maps.places.Autocomplete(ev);
  //   autocomplete.bindTo('bounds', this.map);
  //   return new Observable((sub: any) => {
  //     google.maps.event.addListener(autocomplete, 'place_changed', () => {
  //       const place = autocomplete.getPlace();
  //       if (!place.geometry) {
  //         sub.error({
  //           message: 'Autocomplete returned place with no geometry'
  //         });
  //       } else {
  //         sub.next(place.geometry.location);
  //         sub.complete();
  //       }
  //     });
  //   });
  // }

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

      this.map;

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
          // console.log('Search Lat', place.geometry.location.lat());
          // console.log('Search Lng', place.geometry.location.lng());
          sub.next(place.geometry.location);

          this.y = place.geometry.location;

          console.log(this.y.lat())
          // this.target = true;
          //sub.complete();
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
        // styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] },
        //   { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] },
        //   { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] },
        //   { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 },
        //       { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" },
        //       { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" },
        //       { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" },
        //       { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" },
        //       { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" },
        //       { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" },
        //       { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
        //   { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] },
        //   { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] },
        //   { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      });
      //TODO : ovdje se mora dodati to i promijeniti pozicija
      // this.choosePosition();
      this.trackMe();

      google.maps.event.addListener(this.map, 'bounds_changed', () => {
        this.zone.run(() => {
          this.resizeMap();
        });
      });


    });
  }

  //Center zoom
  //http://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers

  resizeMap() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 200);
  }

  // getCurrentPositionfromStorage(markers) {
  //   this.storage.get('lastLocation').then((result) => {
  //     if (result) {
  //       let myPos = new google.maps.LatLng(result.lat, result.long);
  //       this.map.setOptions({
  //         center: myPos,
  //         zoom: 14
  //       });
  //       let marker = this.addMarker(myPos, "My last saved Location: " + result.location);
  //
  //       markers.push(marker);
  //       this.bounceMap(markers);
  //
  //       this.resizeMap();
  //     }
  //   });
  // }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  choosePosition() {
    this.storage.get('lastLocation').then((result) => {
      if (result) {
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Last Location: ' + result.location,
          buttons: [
            {
              text: 'Reload',
              handler: () => {
                this.getCurrentPosition();
              }
            },
            {
              text: 'Delete',
              handler: () => {
                this.storage.set('lastLocation', null);
                this.showToast('Location deleted!');
                this.initializeMap();
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();
      } else {
        this.getCurrentPosition();

      }
    });
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

          this.showToast('Location found!');

          console.log(position.coords.latitude, position.coords.longitude);
          let myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          let options = {
            center: myPos,
            zoom: 14
          };
          this.map.setOptions(options);
          this.addMarker(myPos, "Mein Standort!");

          // let alert = this.alertCtrl.create({
          //   title: 'Location',
          //   message: 'Do you want to save the Location?',
          //   buttons: [
          //     {
          //       text: 'Cancel'
          //     },
          //     {
          //       text: 'Save',
          //       handler: data => {
          //         let lastLocation = { lat: position.coords.latitude, long: position.coords.longitude };
          //         console.log(lastLocation);
          //         this.storage.set('lastLocation', lastLocation).then(() => {
          //           this.showToast('Location saved');
          //         });
          //       }
          //     }
          //   ]
          // });
          // alert.present();

          ;

        });
      },
      (error) => {
        this.loading.dismiss().then(() => {
          this.showToast('Location not found. Please enable your GPS!');

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

  /////////////////////////////////////////////////////////////////////////

  inputRoute(map) {
    const prompt = this.alertCtrl.create({
      title: 'Router',
      inputs: [
        {
          name: 'from',
          placeholder: 'from',
        },
        {
          name: 'to',
          placeholder: 'to'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');

          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }


  fun(position)
  {
    this.switch = "map";
    this.y = position.geometry.location;
    this.addPlaceMarker(this.y,"To");
    this.starttrackingButton = true;

    // this.startNavigating()
  }


}
