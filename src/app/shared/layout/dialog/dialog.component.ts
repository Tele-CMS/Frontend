import { Component, OnChanges, Input, Inject, Output, EventEmitter, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  message: string = '';
  actions: Array<any>;

  constructor(
    public dialogPopup: MatDialogRef<DialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.actions = (data && data.length) ? data : deafultActions;
  }
  
  ngOnInit() {
    this.dialogPopup.backdropClick().subscribe(result => {
      this.dialogPopup.close();
    })
  }

  handleClick(value: any) {
    this.dialogPopup.close(value);
  }
   
}

const deafultActions = [{
  name: 'yes',
  value: true,
},{
  
  name: 'Cancel',
  value: false,
}]
