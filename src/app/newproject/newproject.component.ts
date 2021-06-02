import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DocumentService} from 'src/app/document.service';

export interface DialogData {
  file: string;
  name: string;
}

@Component({
  selector: 'app-newproject',
  templateUrl: './newproject.component.html',
  styleUrls: ['./newproject.component.css']
})
export class NewprojectComponent implements OnInit {


  items = [];

input:string; email:string;
  add() {
    console.log("add");
    this.items.push(this.input +' : ' + this.email);
    console.log(this.items);
    this.input = '';
  };

  save(data, data1){
    console.log("data:"+data);
    this.documentService.member({projectname:data, members:this.items, user:this.documentService.getname()});
  }

  remove(index) {
    console.log("remove:"+index);
    this.items.splice(index, 1);
  };

  constructor(private documentService: DocumentService, public dialogRef: MatDialogRef<NewprojectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
