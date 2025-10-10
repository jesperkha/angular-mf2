import { Type } from "./facade/type";
import { InjectionToken } from "./injection_token";
import { Injector } from "./injector";
export declare function getCurrentInjector(): Injector | undefined;
export declare function setCurrentInjector(injector: Injector | undefined): Injector | undefined;
export declare function inject<T>(token: Type<T> | InjectionToken<T>): T;
