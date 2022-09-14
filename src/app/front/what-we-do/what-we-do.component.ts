
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";

@Component({
  providers: [HomeHeaderComponent],
  selector: "app-what-we-do",
  templateUrl: "./what-we-do.component.html",
  styleUrls: ["./what-we-do.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class WhatWeDoComponent implements OnInit{
   
    ngOnInit() {}
}
