"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function terminal(props) {
    return function (target, propertyKey, descriptor) {
        if (!('__terminal__' in target))
            target.__terminal__ = { [propertyKey]: props };
        else
            target.__terminal__[propertyKey] = props;
    };
}
exports.default = terminal;
