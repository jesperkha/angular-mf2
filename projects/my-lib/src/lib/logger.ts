import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Logger {
  logs: string[] = []; // capture logs for testing

  log(message: string): string {
    this.logs.push(message);
    console.log(message);
    return message
  }
}
