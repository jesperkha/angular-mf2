import { Pipe, PipeTransform } from '@angular/core';
import { Logger } from './logger';

@Pipe({
  name: 'test'
})
export class TestPipe implements PipeTransform {
  constructor(private logger: Logger) { }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.logger.log(value);
  }

}
