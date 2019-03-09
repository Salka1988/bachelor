import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './guard/auth.guard';

const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard]}, // <--- Important
  { path: 'map', loadChildren: './map/map.module#MapPageModule', canActivate: [AuthGuard]},
  { path: 'homepage', loadChildren: './homepage/homepage.module#HomepagePageModule', canActivate: [AuthGuard]},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
