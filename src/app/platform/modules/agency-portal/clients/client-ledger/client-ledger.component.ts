import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientLedgerModel } from './client-ledger.model';
import { ClientsService } from '../clients.service';
import { ResponseModel, FilterModel } from '../../../core/modals/common-model';
import { MatPaginator, MatSort } from '@angular/material';
import { merge } from 'rxjs';
import { Metadata } from '../../../../../super-admin-portal/core/modals/common-model';
import { CommonService } from '../../../core/services';

@Component({
  selector: 'app-client-ledger',
  templateUrl: './client-ledger.component.html',
  styleUrls: ['./client-ledger.component.css']
})
export class ClientLedgerComponent implements OnInit, AfterViewInit {
  clientId: number;
  header: string = "Patient Ledger";
  claimList: Array<ClientLedgerModel> = [];
  filterModel: FilterModel;
  isDetailPage: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  metaData: Metadata;
  claimId: number;
  paymentStatus:any=[];
  constructor(private activatedRoute: ActivatedRoute, private clientService: ClientsService, private commonService: CommonService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id == undefined ? null : this.commonService.encryptValue(params.id, false);
    });
    this.filterModel = new FilterModel();
    this.metaData = new Metadata();
    this.getClaimListForLedger();
    this.getMasterData();

  }
  getMasterData()
  {
    this.clientService.getMasterData("claimPaymentStatus").subscribe((response:any)=>{
     if(response!=null)
       this.paymentStatus=response.claimPaymentStatus!=null ? response.claimPaymentStatus:[];
    });
  }
  getClaimListForLedger() {
    this.clientService.getClaimsForClientLegder(this.clientId, this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.data != null) {
        this.claimList = response.data;
        this.metaData = response.meta;
      }
    });
  }
  ngAfterViewInit() {
    this.onSortOrPageChanges();;
  }
  onSortOrPageChanges() {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      merge(this.sort.sortChange, this.paginator.page)
        .subscribe(() => {
          const changeState = {
            sort: this.sort.active || '',
            order: this.sort.direction || '',
            pageNumber: (this.paginator.pageIndex + 1)
          }
          this.setPaginatorModel(changeState.pageNumber, this.filterModel.pageSize, changeState.sort, changeState.order);
          this.getClaimListForLedger();
        })
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.filterModel = {
      pageNumber,
      pageSize,
      sortColumn,
      sortOrder,
      searchText: ""
    }
  }
  toggleDetails() {
    this.isDetailPage = false;
    this.getClaimListForLedger()
  }
  getClaimServiceLines(claimId: number) {
    this.isDetailPage = true;
    this.claimId = claimId;
  }
}
