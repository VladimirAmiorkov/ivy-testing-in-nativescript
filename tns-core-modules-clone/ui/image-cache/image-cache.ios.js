Object.defineProperty(exports, "__esModule", { value: true });
var common = require("./image-cache-common");
var trace = require("../../trace");
var utils = require("../../utils/utils");
var httpRequest;
function ensureHttpRequest() {
    if (!httpRequest) {
        httpRequest = require("../../http/http-request");
    }
}
var MemmoryWarningHandler = (function (_super) {
    __extends(MemmoryWarningHandler, _super);
    function MemmoryWarningHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MemmoryWarningHandler.new = function () {
        return _super.new.call(this);
    };
    MemmoryWarningHandler.prototype.initWithCache = function (cache) {
        this._cache = cache;
        NSNotificationCenter.defaultCenter.addObserverSelectorNameObject(this, "clearCache", "UIApplicationDidReceiveMemoryWarningNotification", null);
        if (trace.isEnabled()) {
            trace.write("[MemmoryWarningHandler] Added low memory observer.", trace.categories.Debug);
        }
        return this;
    };
    MemmoryWarningHandler.prototype.dealloc = function () {
        NSNotificationCenter.defaultCenter.removeObserverNameObject(this, "UIApplicationDidReceiveMemoryWarningNotification", null);
        if (trace.isEnabled()) {
            trace.write("[MemmoryWarningHandler] Removed low memory observer.", trace.categories.Debug);
        }
        _super.prototype.dealloc.call(this);
    };
    MemmoryWarningHandler.prototype.clearCache = function () {
        if (trace.isEnabled()) {
            trace.write("[MemmoryWarningHandler] Clearing Image Cache.", trace.categories.Debug);
        }
        this._cache.removeAllObjects();
        utils.GC();
    };
    MemmoryWarningHandler.ObjCExposedMethods = {
        "clearCache": { returns: interop.types.void, params: [] }
    };
    return MemmoryWarningHandler;
}(NSObject));
var Cache = (function (_super) {
    __extends(Cache, _super);
    function Cache() {
        var _this = _super.call(this) || this;
        _this._cache = new NSCache();
        _this._memoryWarningHandler = MemmoryWarningHandler.new().initWithCache(_this._cache);
        return _this;
    }
    Cache.prototype._downloadCore = function (request) {
        var _this = this;
        ensureHttpRequest();
        httpRequest.request({ url: request.url, method: "GET" })
            .then(function (response) {
            try {
                var image = UIImage.alloc().initWithData(response.content.raw);
                if (image) {
                    _this._onDownloadCompleted(request.key, image);
                }
                else {
                    _this._onDownloadError(request.key, new Error("No result for provided url"));
                }
            }
            catch (err) {
                _this._onDownloadError(request.key, err);
            }
        }, function (err) {
            _this._onDownloadError(request.key, err);
        });
    };
    Cache.prototype.get = function (key) {
        return this._cache.objectForKey(key);
    };
    Cache.prototype.set = function (key, image) {
        this._cache.setObjectForKey(image, key);
    };
    Cache.prototype.remove = function (key) {
        this._cache.removeObjectForKey(key);
    };
    Cache.prototype.clear = function () {
        this._cache.removeAllObjects();
        utils.GC();
    };
    return Cache;
}(common.Cache));
exports.Cache = Cache;
//# sourceMappingURL=image-cache.ios.js.map