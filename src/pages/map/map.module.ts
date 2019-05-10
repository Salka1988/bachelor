import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MapPage} from "./map";
import {PlacesPageModule} from "../places/places.module";

@NgModule({
  declarations: [
    MapPage
  ],
  imports: [
    IonicPageModule.forChild(MapPage),
    PlacesPageModule,
  ],
})
export class MapModulePageModule {}



