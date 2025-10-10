/**
 * Current injector value used by `inject`.
 * - `undefined`: it is an error to call `inject`
 * - Injector instance: Use the injector for resolution.
 */
let _currentInjector = undefined;
export function getCurrentInjector() {
    return _currentInjector;
}
export function setCurrentInjector(injector) {
    const former = _currentInjector;
    _currentInjector = injector;
    return former;
}
export function inject(token) {
    if (_currentInjector === undefined) {
        throw new Error(`inject() must be called from an injection context such as a constructor, a factory function, or a field initializer`);
    }
    else {
        const value = _currentInjector.get(token);
        return value;
    }
}
//# sourceMappingURL=injector_compatibility.js.map