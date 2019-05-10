import {Component, ViewChild , OnInit} from '@angular/core';
import {IonicPage, NavController, Navbar, NavParams, Events} from 'ionic-angular';
import {MapPage} from "../map/map";


/**
 * Generated class for the PlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;



@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage implements OnInit{
  private service: any;
  private map: any;
  private places: any;

  @ViewChild(Navbar) navBar: Navbar;

  placesArray: any = [];
  myLocation: any;
  location: any;



  constructor(public navCtrl: NavController ,public events: Events) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad PlacesPage');
  // }


  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      // you can set a full custom history here if you want








      this.navCtrl.setRoot(MapPage);
    }
  }


  reload(){
    this.events.publish('reloadDetails');
    this.navCtrl.pop();
  }



  trackMe() {
    if (navigator.geolocation) {
      // if (this.geolocation) {
      // this.isTracking = true;

      let options = {
        frequency: 120000,
        enableHighAccuracy: false
      };

      navigator.geolocation.watchPosition((position) => {
        this.initializePlaces(position);
      });
    }
  }


  initializePlaces(position) {

    if (position != null)
    {
      console.log("dobar")
    }

    this.map = new google.maps.Map();


    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    this.myLocation = location;

    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: this.myLocation,
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



  // nearbyPlace(){
  //   let service = new google.maps.places.PlacesService(this.map);
  //   service.nearbySearch({
  //     location: this.locationOfMe,
  //     radius: 8047,
  //     types: ["cafe|restaurant|museum"]
  //   }, (results, status) => {
  //     this.callback(results, status);
  //   });
  // }
  //
  // callback(results, status) {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       this.placesArray.push(results[i]);
  //     }
  //   }
  // }


  // navigate to about page

  goToMap() {
    // push about page to the stack
    // parameters as send inside curly brackets as key:value; note that you can send multiple parameters at the same time
    this.navCtrl.push(MapPage,
      {place: this.location}
    );
  }

  ngOnInit(): void {
  }









}
