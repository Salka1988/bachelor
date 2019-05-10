import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlacesPageModule} from "../pages/places/places.module";
import {MapModulePageModule} from "../pages/map/map.module";


const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'map', component: MapModulePageModule},
  { path: 'map/:id', component: MapModulePageModule},
  { path: 'places',   component: PlacesPageModule},
  { path: '**',   component: MapModulePageModule }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MapModulePageModule, PlacesPageModule]

// export const routingComponents = [DepartmentListComponent,
//   DepartmentDetailComponent,
//   EmployeeListComponent,
//   PageNotFoundComponent,
//   DepartmentOverviewComponent,
//   DepartmentContactComponent]
