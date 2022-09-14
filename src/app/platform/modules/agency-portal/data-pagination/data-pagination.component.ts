import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-pagination',
  templateUrl: './data-pagination.component.html',
  styleUrls: ['./data-pagination.component.css']
})
export class DataPaginationComponent implements OnInit {
@Input() page: number;
@Input() itemsPerPage: number;
@Input() pageData:any;

  constructor() { }

  ngOnInit(): void {
  }

}
 