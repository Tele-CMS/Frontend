import { TextChatService } from "./shared/text-chat/text-chat.service";
import { AppService } from "./app-service.service";
import { EncounterModule } from "./platform/modules/agency-portal/encounter/encounter.module";
//import { SubscriberComponent } from "./platform/modules/agency-portal/encounter/video-chat/subscriber/subscriber.component";
import "hammerjs";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AppMaterialModule } from "./app.material.module";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { SubDomainGuard } from "./subDomain.guard";
import { HttpClientModule } from "@angular/common/http";
import { SubDomainService } from "./subDomain.service";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { FrontModule } from "src/app/front/front.module";
import { ResizableModule } from "angular-resizable-element";
import { DragAndDropModule } from "angular-draggable-droppable";
import { MatVideoModule } from "mat-video";
import { HubConnection } from "./hubconnection.service";
//import { PublisherComponent } from "src/app/platform/modules/agency-portal/encounter/video-chat/publisher/publisher.component";
/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 12
    },
    vertical: {
      position: "bottom",
      distance: 12,
      gap: 10
    }
  },
  theme: "material",
  behaviour: {
    autoHide: 5000,
    onClick: "hide",
    onMouseover: "pauseAutoHide",
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease"
    },
    hide: {
      preset: "fade",
      speed: 300,
      easing: "ease",
      offset: 50
    },
    shift: {
      speed: 300,
      easing: "ease"
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppMaterialModule,
    AppRoutingModule,
    SharedModule,
    FrontModule,
    NotifierModule.withConfig(customNotifierOptions),
    ResizableModule,
    DragAndDropModule,
    EncounterModule,
    MatVideoModule
  ],
  providers: [SubDomainGuard, SubDomainService, AppService, TextChatService,HubConnection],
  bootstrap: [AppComponent]
})
export class AppModule {}
