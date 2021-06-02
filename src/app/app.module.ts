import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatButtonModule, MatCheckboxModule, MatTableModule, MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RegistrationComponent } from './header/registration/registration.component';
import { EditorComponent } from './editor/editor.component';
import { TeamComponent } from './team/team.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IntroComponent } from './intro/intro.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentComponent } from './document/document.component';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '../lib/public_api';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SignupComponent } from './header/signup/signup.component';
import { ForgetComponent } from './header/forget/forget.component';
import { NewprojectComponent } from './newproject/newproject.component';
import { NewfileComponent } from './newfile/newfile.component';
import { environment } from '../environments/environment';
const config: SocketIoConfig = { url: 'http://localhost:4600', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegistrationComponent,
    EditorComponent,
    TeamComponent,
    DashboardComponent,
    IntroComponent,
    DocumentListComponent,
    DocumentComponent,
    SignupComponent,
    ForgetComponent,
    NewprojectComponent,
    NewfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CodemirrorModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatDialogModule,
    MatTabsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    //Peer,
    BrowserAnimationsModule,
  SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      { path: 'enter', component: RegistrationComponent },
{ path: 'create_project', component: TeamComponent },
{ path: 'dashboard', component: DashboardComponent },
{ path: 'submit', component: EditorComponent },
{ path: 'signup', component: SignupComponent },
{ path: 'home', component:AppComponent },
{ path: 'forget', component:ForgetComponent}
    ])
  ],
  entryComponents:[
    NewprojectComponent,
    NewfileComponent,
    RegistrationComponent,
    TeamComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
