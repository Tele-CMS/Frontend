import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ViewEncapsulation } from '@angular/core';
import { userInfo } from 'os';
import { ResponseModel } from '../../../core/modals/common-model';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { CommonService } from '../../../core/services';
import { CategoryComponent } from '../category/category.component';
import { CategoryCodeComponent } from '../category-code/category-code.component';
import { SectionComponent } from '../section/section.component';
import { SectionItemsComponent } from '../section-items/section-items.component';

@Component({
  selector: 'app-questionnaire-index',
  templateUrl: './questionnaire-index.component.html',
  styleUrls: ['./questionnaire-index.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionnaireIndexComponent implements OnInit {
  @ViewChild('tabContent', { read: ViewContainerRef })
  tabContent: ViewContainerRef;
  questionnaireTabs: any;
  documentId: number = null;
  selectedIndex: number = 0;
  constructor(private cfr: ComponentFactoryResolver, private activatedRoute: ActivatedRoute) {
    this.questionnaireTabs =
      ["Category", "Category Code", "Section", "Section Items"]
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.documentId = params.id;
      this.loadChild("Category");
    });
  }
  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    if (childName == "Category")
      factory = this.cfr.resolveComponentFactory(CategoryComponent);
    else if (childName == "Category Code")
      factory = this.cfr.resolveComponentFactory(CategoryCodeComponent);
    else if (childName == "Section")
      factory = this.cfr.resolveComponentFactory(SectionComponent);
    else if (childName == "Section Items")
      factory = this.cfr.resolveComponentFactory(SectionItemsComponent);
    this.tabContent.clear();
    let comp: ComponentRef<CategoryComponent> = this.tabContent.createComponent(factory);
    comp.instance.documentId = this.documentId;
  }
}
