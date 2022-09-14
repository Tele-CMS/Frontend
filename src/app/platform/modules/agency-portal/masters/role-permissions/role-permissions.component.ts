import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from './role-permission.service';
import { ResponseModel } from '../../../core/modals/common-model';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { element } from 'protractor';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.css']
})
export class RolePermissionsComponent implements OnInit {
  masterRoles: any;
  modulePermissions: any;
  screenPermissions: any;
  actionPermissions: any;
  rolePermissionForm: FormGroup;
  items: FormArray;
  submitted:boolean=false;
  constructor(private rolePermissionService: RolePermissionService, private formBuilder: FormBuilder,private notifier: NotifierService) {
    this.masterRoles = [];
    this.modulePermissions = [];
    this.screenPermissions = [];
    this.actionPermissions = []
  }

  ngOnInit() {
    this.rolePermissionForm = this.formBuilder.group({
      roleId: []
    });
    this.getMasterRoles();
    this.getRolePermissions();
  }

  get formControls() { return this.rolePermissionForm.controls }

  onSubmit() {
    if(!this.rolePermissionForm.invalid)
    {
      this.submitted=true;
      let roleId = this.rolePermissionForm.value.roleId;
      //Remove this loop and add roleId on server side.All the loops will be removed from here.
      this.modulePermissions.forEach(element => {
        element.roleId=roleId;
      });
      this.screenPermissions.forEach(element => {
        element.roleId=roleId;
      });
      this.actionPermissions.forEach(element => {
        element.roleId=roleId;
      });      
      let requestData={
        'modulePermissions' : this.modulePermissions,
        'screenPermissions' : this.screenPermissions,
        'actionPermissions' : this.actionPermissions,
      };
      this.rolePermissionService.create(JSON.stringify(requestData)).subscribe((response:ResponseModel)=>{
        this.submitted=false;
        if (response.statusCode == 200) {          
          this.notifier.notify('success', response.message)          
          this.getRolePermissions(roleId);
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }

  getMasterRoles() {
    this.rolePermissionService.getMasterData('masterRoles').subscribe((response: any) => {
      this.masterRoles = (response != null && response.masterRoles != null) ? response.masterRoles : [];
    });
  }
  getRolePermissions(roleId: number = 0) {
    this.rolePermissionService.getRolePermissions(roleId).subscribe((response: ResponseModel) => {  
      this.modulePermissions = response.data.modulePermissions;
      this.screenPermissions = response.data.screenPermissions;
      this.actionPermissions = response.data.actionPermissions;
    });
  }
  setPermission(id: number, type: string) {
    let permission=false;
    if(type=='module')
    { 
       permission=this.modulePermissions.find(x => x.moduleId == id).permission;
       this.modulePermissions.find(x => x.moduleId == id).permission=permission==false?true:false;

       this.screenPermissions.filter(x=>x.moduleId==id).forEach(element => {
         element.permission=permission==false?true:false;
       });

       this.actionPermissions.filter(x=>x.moduleId==id).forEach(element => {
        element.permission=permission==false?true:false;
      });      
    }
    else if(type=='screen')
    {
      permission= this.screenPermissions.find(x => x.screenId == id).permission
      this.screenPermissions.find(x => x.screenId == id).permission=permission==false?true:false;
      
      this.actionPermissions.filter(x=>x.screenId==id).forEach(element => {
        element.permission=permission==false?true:false;
      });   
    }
    else if(type=='action')
    {
      permission=this.actionPermissions.find(x => x.actionId == id).permission
      this.actionPermissions.find(x => x.actionId == id).permission=permission==false?true:false;
    }
  }
  filterItems(id :number,type:string){
    if(type=='screen')
      return this.screenPermissions.filter(x => x.moduleId == id);
    else if(type=='action')
      return this.actionPermissions.filter(x => x.screenId == id);
}
changeClass(moduleId:number,screenId:number,type:string)
{
  if(type=='module')
  {

    Array.from(document.getElementsByClassName("moduleClass"+moduleId)).forEach(function(item:any) {
      if(item.classList.contains('fa-plus-square')) {
        item.classList.remove('fa-plus-square');
        item.classList.add('fa-minus-square');
      }
      else
      {
        item.classList.add('fa-plus-square');
        item.classList.remove('fa-minus-square');
      }
    });

  Array.from(document.getElementsByClassName("screenClass"+moduleId)).forEach(function(item:any) {
      if(item.classList.contains('screen-show')) {
        item.classList.remove('screen-show');
        item.classList.add('screen-hide');
      } 
      else {
        item.classList.remove('screen-hide');
        item.classList.add('screen-show');
      }
 });
}
else if(type=='screen')
{
  Array.from(document.getElementsByClassName("screenButton"+screenId)).forEach(function(item:any) {
    if(item.classList.contains('fa-plus-square')) {
      item.classList.remove('fa-plus-square');
      item.classList.add('fa-minus-square');
    }
    else
    {
      item.classList.add('fa-plus-square');
      item.classList.remove('fa-minus-square');
    }
  });
  Array.from(document.getElementsByClassName("actionClass"+screenId)).forEach(function(item:any) {
    if(item.classList.contains('screen-show')) {
      item.classList.remove('screen-show')
      item.classList.add('screen-hide')
    } 
    else {
      item.classList.remove('screen-hide')
      item.classList.add('screen-show')
    }
});
}
}
}
