import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MF2Config, MF2Pipe, Store, useMF2Config } from 'mf2';
import translations from '../../translations/app.json';

const config: MF2Config = {
  defaultLocale: 'en',
  catalogs: {
    en: {
      greeting: 'Hello {$name}, how are you?',
    },
    no: {
      greeting: 'Hei {$name}, hvordan går det?',
    },
  },
};

const jsonConfig: MF2Config = {
  defaultLocale: 'en',
  catalogs: translations,
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MF2Pipe],
  providers: [...useMF2Config(config)],
  template: `
    <h1>{{ 'greeting' | mf2 : { name: 'Bob' } }}</h1>

    <div class="toolbar">
      <button type="button" (click)="setEn()">English (en)</button>

      <button type="button" (click)="setNo()">Norsk (no)</button>
    </div>
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
