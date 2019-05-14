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
import {MapModulePageModule} from "../pages/map/map.module";


@NgModule({
  declarations: [
    MyApp,
    // MapPage
  ],
  imports: [
    BrowserModule,
    MapModulePageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
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
  ]
})
export class AppModule { }
