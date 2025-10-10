import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MF2Pipe, Store } from 'mf2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MF2Pipe],
  template: `
    <div class="toolbar">
      <button type="button" (click)="setEn()">English (en)</button>

      <button type="button" (click)="setNo()">Norsk (no)</button>
    </div>

    <h1>{{ 'hello' | mf2 : { name: 'thomas' } }}</h1>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  private store = inject(Store);

  // expose the signal so the template can read it with locale()

  setEn() {
    this.store.setLocale('en');
  }
  setNo() {
    this.store.setLocale('no');
  }
}
