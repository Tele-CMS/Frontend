import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
const signalR = require("@aspnet/signalr");
// import * as signalR from '@aspnet/signalr/dist/browser/signalr.js';
// import signalR from '@aspnet/signalr';

export class HubConnection {
  hubConnection: any;
  constructor() {
    //this.hubConnection = new HubConnection();
    this.createHubConnection = this.createHubConnection.bind(this);
  }

  createHubConnection = (access_token) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.api_url}/chathub`, {
        accessTokenFactory: () => access_token,
      })
      .configureLogging(signalR.LogLevel.Error)
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 600000; // 10 minutes

    return this.hubConnection.start();
  };

  getHubConnection() {
    return this.hubConnection;
  }

  restartHubConnection() {
    let self = this;
    return new Promise((resolve, reject) => {
      if (self.isDisconnected()) {
        self.hubConnection
          .start()
          .then((hubConnection) => {
            resolve(hubConnection);
          })
          .catch((err) => {
            console.log("signalr Error", err);
            reject(err);
          });
      }
    });
  }
  //   getHandler() {
  //     return this.sb;
  //   }

  isConnected() {
    return (
      this.hubConnection && this.hubConnection.connection.connectionState === 1
    );
  }

  isDisconnected() {
    return (
      this.hubConnection && this.hubConnection.connection.connectionState === 2
    );
  }

  // ConnectToServerWithUserId(userId) {
  //     return this.hubConnection.invoke('Connect', userId);
  // }
  ConnectToServerWithUserId(userId: number, roomId: number) {
    var room = this.hubConnection.invoke("Connect", userId, roomId);
    
    return room;
  }
  ConnectWithAccessToken() {
    var room = this.hubConnection.invoke("ConnectWithAccessToken");
    return room;
  }
  ConnectWithBussinessToken(userId: number) {
    var room = this.hubConnection.invoke("ConnectWithBussinessToken", userId);
    return room;
  }
}
