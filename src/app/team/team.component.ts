import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DocumentService} from 'src/app/document.service';
import { Subscription } from 'rxjs';
export interface DialogData3 {
  proid: string;
}
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  items = [];
  existspro: Subscription;
  constructor(private documentService: DocumentService,public dialogRef: MatDialogRef<TeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData3) { }

  ngOnInit() {
    this.existspro = this.documentService.prolist.subscribe(doc => {
      for(let i of doc)
      this.items.push(i);
    });
  }
  /*load(data){
    console.log("load:"+data);
    this.documentService.tproject({projectid:data+'@'+this.documentService.getname(), user:this.documentService.getname()});
    this.dialogRef.close();
  }*/
 loadid(data){
   console.log("loadid:"+data);
    this.documentService.tproject({projectid:data, user:this.documentService.getname()});
    //this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
