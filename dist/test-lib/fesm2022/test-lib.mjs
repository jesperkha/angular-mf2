import * as i0 from '@angular/core';
import { Component, Injectable, Pipe } from '@angular/core';

class TestLib {
    static ɵfac = function TestLib_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TestLib)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TestLib, selectors: [["lib-test-lib"]], decls: 2, vars: 0, template: function TestLib_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "p");
            i0.ɵɵtext(1, " test-lib works! ");
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TestLib, [{
        type: Component,
        args: [{ selector: 'lib-test-lib', imports: [], template: `
    <p>
      test-lib works!
    </p>
  ` }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TestLib, { className: "TestLib", filePath: "lib/test-lib.ts", lineNumber: 13 }); })();

class Logger {
    constructor() { }
    log(value) {
        console.log(value);
        return value;
    }
    static ɵfac = function Logger_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Logger)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: Logger, factory: Logger.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Logger, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [], null); })();

class TestPipe {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    transform(value, ...args) {
        return this.logger.log(value);
    }
    static ɵfac = function TestPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TestPipe)(i0.ɵɵdirectiveInject(Logger, 16)); };
    static ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "test", type: TestPipe, pure: true });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TestPipe, [{
        type: Pipe,
        args: [{
                name: 'test'
            }]
    }], () => [{ type: Logger }], null); })();

/*
 * Public API Surface of test-lib
 */

/**
 * Generated bundle index. Do not edit.
 */

export { TestLib, TestPipe };
//# sourceMappingURL=test-lib.mjs.map
