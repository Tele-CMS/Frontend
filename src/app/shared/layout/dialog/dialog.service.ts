import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  public confirm(
    message: string,
    data?: Array<any>): Observable<any> {
    const modalRef = this.dialog.open(DialogComponent, { data: data, hasBackdrop: true, backdropClass: 'no-backdrop', disableClose: false, width: 'auto', minWidth: 'auto',maxWidth: 'auto', position: { bottom: '10px', right: '10px' } });
    modalRef.componentInstance.message = message;
    return modalRef.afterClosed();
  }

}
