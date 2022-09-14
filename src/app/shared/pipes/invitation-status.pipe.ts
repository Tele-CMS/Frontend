import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invitationStatus'
})
export class InvitationStatusPipe implements PipeTransform {

  transform(value: any, type?: any): any {
    let updatedValue = '', className = '';
    className="user-invitation-"+value; 
    return `<span class="${className.toLowerCase()}">${value}</span>`;
  }

}
