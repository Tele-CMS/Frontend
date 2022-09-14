import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-lab-orders',
  templateUrl: './lab-orders.component.html',
  styleUrls: ['./lab-orders.component.css']
})
export class LabOrdersComponent implements OnInit {
  clientId: number;
  header:string="Patient Lab Orders";
  constructor(private activatedRoute: ActivatedRoute,private commonService:CommonService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id==undefined?null:this.commonService.encryptValue(params.id,false);      
    });
  }

}
