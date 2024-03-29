Object.defineProperty(exports, "__esModule", { value: true });
var ns_location_strategy_1 = require("./ns-location-strategy");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var trace_1 = require("../trace");
var NativescriptPlatformLocation = /** @class */ (function (_super) {
    __extends(NativescriptPlatformLocation, _super);
    function NativescriptPlatformLocation(locationStrategy) {
        var _this = _super.call(this) || this;
        _this.locationStrategy = locationStrategy;
        if (trace_1.isLogEnabled()) {
            trace_1.routerLog("NativescriptPlatformLocation.constructor()");
        }
        return _this;
    }
    NativescriptPlatformLocation.prototype.getState = function () {
        return undefined;
    };
    NativescriptPlatformLocation.prototype.getBaseHrefFromDOM = function () {
        return "/";
    };
    NativescriptPlatformLocation.prototype.onPopState = function (fn) {
        this.locationStrategy.onPopState(fn);
    };
    NativescriptPlatformLocation.prototype.onHashChange = function (_fn) {
    };
    Object.defineProperty(NativescriptPlatformLocation.prototype, "search", {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NativescriptPlatformLocation.prototype, "hash", {
        get: function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NativescriptPlatformLocation.prototype, "pathname", {
        get: function () {
            return this.locationStrategy.path();
        },
        set: function (_newPath) {
            throw new Error("NativescriptPlatformLocation set pathname - not implemented");
        },
        enumerable: true,
        configurable: true
    });
    NativescriptPlatformLocation.prototype.pushState = function (state, title, url) {
        this.locationStrategy.pushState(state, title, url, null);
    };
    NativescriptPlatformLocation.prototype.replaceState = function (state, title, url) {
        this.locationStrategy.replaceState(state, title, url, null);
    };
    NativescriptPlatformLocation.prototype.forward = function () {
        throw new Error("NativescriptPlatformLocation.forward() - not implemented");
    };
    NativescriptPlatformLocation.prototype.back = function () {
        this.locationStrategy.back();
    };
    NativescriptPlatformLocation = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ns_location_strategy_1.NSLocationStrategy])
    ], NativescriptPlatformLocation);
    return NativescriptPlatformLocation;
}(common_1.PlatformLocation));
exports.NativescriptPlatformLocation = NativescriptPlatformLocation;
//# sourceMappingURL=ns-platform-location.js.map