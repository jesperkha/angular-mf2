import * as i0 from '@angular/core';
import { PipeTransform } from '@angular/core';

declare class TestLib {
    static ɵfac: i0.ɵɵFactoryDeclaration<TestLib, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TestLib, "lib-test-lib", never, {}, {}, never, never, true, never>;
}

declare class Logger {
    constructor();
    log(value: unknown): unknown;
    static ɵfac: i0.ɵɵFactoryDeclaration<Logger, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Logger>;
}

declare class TestPipe implements PipeTransform {
    private logger;
    constructor(logger: Logger);
    transform(value: unknown, ...args: unknown[]): unknown;
    static ɵfac: i0.ɵɵFactoryDeclaration<TestPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<TestPipe, "test", true>;
}

export { TestLib, TestPipe };
