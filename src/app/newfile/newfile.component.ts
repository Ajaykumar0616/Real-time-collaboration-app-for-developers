import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData2 {
  filename: string;
  name: string;
}
@Component({
  selector: 'app-newfile',
  templateUrl: './newfile.component.html',
  styleUrls: ['./newfile.component.css']
})
export class NewfileComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData2) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
