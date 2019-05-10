import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';


import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { DeviceMotion, DeviceMotionAccelerationData} from "@ionic-native/device-motion";
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';
import {DeviceOrientation} from "@ionic-native/device-orientation";
import {PlacesPageModule} from "../pages/places/places.module";
import {MapModulePageModule} from "../pages/map/map.module";
import {AppRoutingModule, routingComponents} from "./app-routing.module";


@NgModule({
  declarations: [
    MyApp,
    // MapPage
  ],
  imports: [
    BrowserModule,
    PlacesPageModule,
    MapModulePageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AppRoutingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
    // MapPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    DeviceMotion,
    Gyroscope,
    DeviceOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppRoutingModule
  ]
})
export class AppModule { }
