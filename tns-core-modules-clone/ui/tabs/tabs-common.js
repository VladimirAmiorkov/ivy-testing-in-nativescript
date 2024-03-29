function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var tab_navigation_base_1 = require("../tab-navigation-base/tab-navigation-base");
var view_1 = require("../core/view");
var properties_1 = require("../core/properties");
__export(require("../tab-navigation-base/tab-content-item"));
__export(require("../tab-navigation-base/tab-navigation-base"));
__export(require("../tab-navigation-base/tab-strip"));
__export(require("../tab-navigation-base/tab-strip-item"));
exports.traceCategory = "TabView";
var knownCollections;
(function (knownCollections) {
    knownCollections.items = "items";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var TabsBase = (function (_super) {
    __extends(TabsBase, _super);
    function TabsBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabsBase = __decorate([
        view_1.CSSType("Tabs")
    ], TabsBase);
    return TabsBase;
}(tab_navigation_base_1.TabNavigationBase));
exports.TabsBase = TabsBase;
exports.swipeEnabledProperty = new properties_1.Property({
    name: "swipeEnabled", defaultValue: true, valueConverter: view_1.booleanConverter
});
exports.swipeEnabledProperty.register(TabsBase);
exports.offscreenTabLimitProperty = new properties_1.Property({
    name: "offscreenTabLimit", defaultValue: 1, valueConverter: function (v) { return parseInt(v); }
});
exports.offscreenTabLimitProperty.register(TabsBase);
exports.tabsPositionProperty = new properties_1.Property({ name: "tabsPosition", defaultValue: "top" });
exports.tabsPositionProperty.register(TabsBase);
//# sourceMappingURL=tabs-common.js.map