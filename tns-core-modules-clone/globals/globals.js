Object.defineProperty(exports, "__esModule", { value: true });
require("./ts-helpers");
require("./register-module-helpers");
global.moduleMerge = function (sourceExports, destExports) {
    for (var key in sourceExports) {
        destExports[key] = sourceExports[key];
    }
};
global.zonedCallback = function (callback) {
    if (global.zone) {
        return global.zone.bind(callback);
    }
    if (global.Zone) {
        return global.Zone.current.wrap(callback);
    }
    else {
        return callback;
    }
};
global.registerModule("timer", function () { return require("../timer"); });
global.registerModule("ui/dialogs", function () { return require("../ui/dialogs"); });
global.registerModule("xhr", function () { return require("../xhr"); });
global.registerModule("fetch", function () { return require("../fetch"); });
global.System = {
    import: function (path) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(global.require(path));
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
function registerOnGlobalContext(name, module) {
    Object.defineProperty(global, name, {
        get: function () {
            var m = global.loadModule(module);
            var resolvedValue = m[name];
            Object.defineProperty(global, name, { value: resolvedValue, configurable: true, writable: true });
            return resolvedValue;
        },
        configurable: true
    });
}
var snapshotGlobals;
function install() {
    if (global.__snapshot || global.__snapshotEnabled) {
        if (!snapshotGlobals) {
            var timer = require("../timer");
            var dialogs = require("../ui/dialogs");
            var xhr = require("../xhr");
            var fetch_1 = require("../fetch");
            snapshotGlobals = snapshotGlobals || {
                setTimeout: timer.setTimeout,
                clearTimeout: timer.clearTimeout,
                setInterval: timer.setInterval,
                clearInterval: timer.clearInterval,
                alert: dialogs.alert,
                confirm: dialogs.confirm,
                prompt: dialogs.prompt,
                login: dialogs.login,
                action: dialogs.action,
                XMLHttpRequest: xhr.XMLHttpRequest,
                FormData: xhr.FormData,
                fetch: fetch_1.fetch,
                Headers: fetch_1.Headers,
                Request: fetch_1.Request,
                Response: fetch_1.Response,
            };
        }
        var consoleModule = require("../console").Console;
        global.console = global.console || new consoleModule();
        Object.assign(global, snapshotGlobals);
    }
    else {
        registerOnGlobalContext("setTimeout", "timer");
        registerOnGlobalContext("clearTimeout", "timer");
        registerOnGlobalContext("setInterval", "timer");
        registerOnGlobalContext("clearInterval", "timer");
        registerOnGlobalContext("alert", "ui/dialogs");
        registerOnGlobalContext("confirm", "ui/dialogs");
        registerOnGlobalContext("prompt", "ui/dialogs");
        registerOnGlobalContext("login", "ui/dialogs");
        registerOnGlobalContext("action", "ui/dialogs");
        registerOnGlobalContext("XMLHttpRequest", "xhr");
        registerOnGlobalContext("FormData", "xhr");
        registerOnGlobalContext("fetch", "fetch");
        registerOnGlobalContext("Headers", "fetch");
        registerOnGlobalContext("Request", "fetch");
        registerOnGlobalContext("Response", "fetch");
    }
}
exports.install = install;
install();
function Deprecated(target, key, descriptor) {
    if (descriptor) {
        var originalMethod_1 = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(key.toString() + " is deprecated");
            return originalMethod_1.apply(this, args);
        };
        return descriptor;
    }
    else {
        console.log((target && target.name || target) + " is deprecated");
        return target;
    }
}
exports.Deprecated = Deprecated;
global.Deprecated = Deprecated;
function Experimental(target, key, descriptor) {
    if (descriptor) {
        var originalMethod_2 = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(key.toString() + " is experimental");
            return originalMethod_2.apply(this, args);
        };
        return descriptor;
    }
    else {
        console.log((target && target.name || target) + " is experimental");
        return target;
    }
}
exports.Experimental = Experimental;
global.Experimental = Experimental;
//# sourceMappingURL=globals.js.map