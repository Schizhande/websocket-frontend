import {Component} from '@angular/core';
import * as Stomp from 'stompjs';

// import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  greetings: string[] = [];
  showConversation: boolean = false;
  ws: any;
  name!: string;
  disabled!: boolean;

  constructor() {
    this.connect();
  }

  connect() {
    let socket = new WebSocket("ws://localhost:8069/opn/v1/notifications/my-notifications");
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect({token: "Auth token"
    }, function () {
      that.ws.subscribe("/errors", function (message: { body: string; }) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/user/topic/my-notifications", function (message: { body: string; }) {
        console.log(message)
        that.showGreeting(message.body);
      });
      that.disabled = true;
    }, function (error: string) {
      alert("STOMP error " + error);
    });
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    this.setConnected(false);
    console.log("Disconnected");
  }

  sendName() {
    let data = JSON.stringify({
      'name': this.name
    })
    this.ws.send("/app/message", {}, data);
  }

  showGreeting(message: string) {
    this.showConversation = true;
    this.greetings.push(message)
  }

  setConnected(connected: boolean) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }
}
