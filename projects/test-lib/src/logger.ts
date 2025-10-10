import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Logger {
  constructor() { }

  log(value: unknown): unknown {
    console.log(value)
    return value
  }

}
