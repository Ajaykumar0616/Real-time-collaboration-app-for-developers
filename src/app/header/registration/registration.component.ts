import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { DocumentService } from 'src/app/document.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
logged: Subscription;
contentEditable = false;
 /* toggleEditable(event) {
    if ( event.target.checked ) {
        this.contentEditable = true;
   }
}*/
  login(username, password){
      if(username === "" || password==="")
      {
        document.getElementById('error-container').innerHTML += "Please fill all fields correctlly";
      }
      else
      {
        console.log("registration.ts:");
          this.documentService.login({username: username, password: password});
      }
  }
  constructor(private documentService: DocumentService, private router: Router, public dialogRef: MatDialogRef<RegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
      this.logged = this.documentService.logged.subscribe(doc => {if(doc === "no"){
        document.getElementById('error-container').innerHTML = "Wrong Credentials";
      }
    else{
      this.documentService.setname(doc);
      this.router.navigate(['/','submit']);
      this.dialogRef.close();
    }});

  }

}
