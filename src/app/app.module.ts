import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MainComponent } from './pages/main/main.component';
import { MonitorsComponent } from './pages/monitors/monitors.component';
import { ProcessorsComponent } from './pages/processors/processors.component';
import { VideoCardsComponent } from './pages/video-cards/video-cards.component';
import { DrivesComponent } from './pages/drives/drives.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { provideHttpClient, withFetch, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorInterceptor } from './сore/interceptor/error.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
  {path: '', component: MainComponent},
  {path: 'monitors', component: MonitorsComponent},
  {path: 'processors', component: ProcessorsComponent},
  {path: 'videoCards', component: VideoCardsComponent},
  {path: 'drives', component: DrivesComponent},
  {path: 'devices', component: DevicesComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MonitorsComponent,
    ProcessorsComponent,
    VideoCardsComponent,
    DrivesComponent,
    DevicesComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
