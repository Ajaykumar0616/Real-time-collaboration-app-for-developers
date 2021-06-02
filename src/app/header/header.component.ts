import { Component, OnInit} from '@angular/core';
import { DocumentService } from 'src/app/document.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RegistrationComponent } from './registration/registration.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{
log:Subscription;
    logornot()
    { console.log("ngclick");
    
        this.documentService.logornot();
    }

    constructor(private documentService: DocumentService, private router: Router, public dialog: MatDialog) { }
    ngOnInit(){
        this.log = this.documentService.log.subscribe(doc=> {if(doc.session === "session"){
            this.documentService.setname(doc.user);
            this.router.navigate(['/', 'submit']);
        }else{
            console.log("create login:");
  const dialogRef = this.dialog.open(RegistrationComponent, {
    width: '350px',
    height: '300px'
    //data: {name: data, file: this.file}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.animal = result;
    //console.log("result:"+result);
    //document.getElementById("spannew").innerHTML = result;
  });
            //this.router.navigate(['/', 'enter']);

        }
    });
    }
}