function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var tab_strip_item_1 = require("../tab-navigation-base/tab-strip-item");
var tab_navigation_base_1 = require("../tab-navigation-base/tab-navigation-base");
var tabs_common_1 = require("./tabs-common");
var font_1 = require("../styling/font");
var text_base_1 = require("../text-base");
var frame_1 = require("../frame");
var view_1 = require("../core/view");
var image_source_1 = require("../../image-source");
var utils_1 = require("../../utils/utils");
var application = require("../../application");
__export(require("./tabs-common"));
var ACCENT_COLOR = "colorAccent";
var PRIMARY_COLOR = "colorPrimary";
var DEFAULT_ELEVATION = 4;
var TABID = "_tabId";
var INDEX = "_index";
var PagerAdapter;
var TabLayout;
function makeFragmentName(viewId, id) {
    return "android:viewpager:" + viewId + ":" + id;
}
function getTabById(id) {
    var ref = exports.tabs.find(function (ref) {
        var tab = ref.get();
        return tab && tab._domId === id;
    });
    return ref && ref.get();
}
function initializeNativeClasses() {
    if (PagerAdapter) {
        return;
    }
    var TabFragmentImplementation = (function (_super) {
        __extends(TabFragmentImplementation, _super);
        function TabFragmentImplementation() {
            var _this = _super.call(this) || this;
            return global.__native(_this);
        }
        TabFragmentImplementation.newInstance = function (tabId, index) {
            var args = new android.os.Bundle();
            args.putInt(TABID, tabId);
            args.putInt(INDEX, index);
            var fragment = new TabFragmentImplementation();
            fragment.setArguments(args);
            return fragment;
        };
        TabFragmentImplementation.prototype.onCreate = function (savedInstanceState) {
            _super.prototype.onCreate.call(this, savedInstanceState);
            var args = this.getArguments();
            this.tab = getTabById(args.getInt(TABID));
            this.index = args.getInt(INDEX);
            if (!this.tab) {
                throw new Error("Cannot find TabView");
            }
        };
        TabFragmentImplementation.prototype.onCreateView = function (inflater, container, savedInstanceState) {
            var tabItem = this.tab.items[this.index];
            return tabItem.view.nativeViewProtected;
        };
        return TabFragmentImplementation;
    }(org.nativescript.widgets.FragmentBase));
    var POSITION_UNCHANGED = -1;
    var POSITION_NONE = -2;
    var FragmentPagerAdapter = (function (_super) {
        __extends(FragmentPagerAdapter, _super);
        function FragmentPagerAdapter(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        FragmentPagerAdapter.prototype.getCount = function () {
            var items = this.items;
            return items ? items.length : 0;
        };
        FragmentPagerAdapter.prototype.getPageTitle = function (index) {
            var items = this.items;
            if (index < 0 || index >= items.length) {
                return "";
            }
            return "";
        };
        FragmentPagerAdapter.prototype.startUpdate = function (container) {
            if (container.getId() === android.view.View.NO_ID) {
                throw new Error("ViewPager with adapter " + this + " requires a view containerId");
            }
        };
        FragmentPagerAdapter.prototype.instantiateItem = function (container, position) {
            var fragmentManager = this.owner._getFragmentManager();
            if (!this.mCurTransaction) {
                this.mCurTransaction = fragmentManager.beginTransaction();
            }
            var itemId = this.getItemId(position);
            var name = makeFragmentName(container.getId(), itemId);
            var fragment = fragmentManager.findFragmentByTag(name);
            if (fragment != null) {
                this.mCurTransaction.attach(fragment);
            }
            else {
                fragment = TabFragmentImplementation.newInstance(this.owner._domId, position);
                this.mCurTransaction.add(container.getId(), fragment, name);
            }
            if (fragment !== this.mCurrentPrimaryItem) {
                fragment.setMenuVisibility(false);
                fragment.setUserVisibleHint(false);
            }
            var tabItems = this.owner.items;
            var tabItem = tabItems ? tabItems[position] : null;
            if (tabItem) {
                tabItem.canBeLoaded = true;
            }
            return fragment;
        };
        FragmentPagerAdapter.prototype.getItemPosition = function (object) {
            return this.items ? POSITION_UNCHANGED : POSITION_NONE;
        };
        FragmentPagerAdapter.prototype.destroyItem = function (container, position, object) {
            if (!this.mCurTransaction) {
                var fragmentManager = this.owner._getFragmentManager();
                this.mCurTransaction = fragmentManager.beginTransaction();
            }
            var fragment = object;
            this.mCurTransaction.detach(fragment);
            if (this.mCurrentPrimaryItem === fragment) {
                this.mCurrentPrimaryItem = null;
            }
            var tabItems = this.owner.items;
            var tabItem = tabItems ? tabItems[position] : null;
            if (tabItem) {
                tabItem.canBeLoaded = false;
            }
        };
        FragmentPagerAdapter.prototype.setPrimaryItem = function (container, position, object) {
            var fragment = object;
            if (fragment !== this.mCurrentPrimaryItem) {
                if (this.mCurrentPrimaryItem != null) {
                    this.mCurrentPrimaryItem.setMenuVisibility(false);
                    this.mCurrentPrimaryItem.setUserVisibleHint(false);
                }
                if (fragment != null) {
                    fragment.setMenuVisibility(true);
                    fragment.setUserVisibleHint(true);
                }
                this.mCurrentPrimaryItem = fragment;
                this.owner.selectedIndex = position;
                var tab = this.owner;
                var tabItems = tab.items;
                var newTabItem = tabItems ? tabItems[position] : null;
                if (newTabItem) {
                    tab._loadUnloadTabItems(tab.selectedIndex);
                }
            }
        };
        FragmentPagerAdapter.prototype.finishUpdate = function (container) {
            this._commitCurrentTransaction();
        };
        FragmentPagerAdapter.prototype.isViewFromObject = function (view, object) {
            return object.getView() === view;
        };
        FragmentPagerAdapter.prototype.saveState = function () {
            this._commitCurrentTransaction();
            return null;
        };
        FragmentPagerAdapter.prototype.restoreState = function (state, loader) {
        };
        FragmentPagerAdapter.prototype.getItemId = function (position) {
            return position;
        };
        FragmentPagerAdapter.prototype._commitCurrentTransaction = function () {
            if (this.mCurTransaction != null) {
                this.mCurTransaction.commitNowAllowingStateLoss();
                this.mCurTransaction = null;
            }
        };
        return FragmentPagerAdapter;
    }(androidx.viewpager.widget.PagerAdapter));
    var TabLayoutImplementation = (function (_super) {
        __extends(TabLayoutImplementation, _super);
        function TabLayoutImplementation(context, owner) {
            var _this = _super.call(this, context) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        TabLayoutImplementation.prototype.onSelectedPositionChange = function (position, prevPosition) {
            var owner = this.owner;
            if (!owner) {
                return;
            }
            var tabStripItems = owner.tabStrip && owner.tabStrip.items;
            if (position >= 0 && tabStripItems && tabStripItems[position]) {
                tabStripItems[position]._emit(tab_strip_item_1.TabStripItem.selectEvent);
            }
            if (prevPosition >= 0 && tabStripItems && tabStripItems[prevPosition]) {
                tabStripItems[prevPosition]._emit(tab_strip_item_1.TabStripItem.unselectEvent);
            }
        };
        TabLayoutImplementation.prototype.onTap = function (position) {
            var owner = this.owner;
            if (!owner) {
                return false;
            }
            var tabStripItems = owner.tabStrip && owner.tabStrip.items;
            if (position >= 0 && tabStripItems[position]) {
                tabStripItems[position]._emit(tab_strip_item_1.TabStripItem.tapEvent);
            }
            if (!owner.items[position]) {
                return false;
            }
            return true;
        };
        return TabLayoutImplementation;
    }(org.nativescript.widgets.TabLayout));
    PagerAdapter = FragmentPagerAdapter;
    TabLayout = TabLayoutImplementation;
}
function createTabItemSpec(tabStripItem) {
    var iconSource;
    var tabItemSpec = new org.nativescript.widgets.TabItemSpec();
    if (tabStripItem.backgroundColor instanceof view_1.Color) {
        tabItemSpec.backgroundColor = tabStripItem.backgroundColor.android;
    }
    iconSource = tabStripItem.image ? tabStripItem.image.src : tabStripItem.iconSource;
    tabItemSpec.title = tabStripItem.label ? tabStripItem.label.text : tabStripItem.title;
    if (iconSource) {
        if (iconSource.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
            tabItemSpec.iconId = utils_1.ad.resources.getDrawableId(iconSource.substr(utils_1.RESOURCE_PREFIX.length));
            if (tabItemSpec.iconId === 0) {
            }
        }
        else {
            var is = new image_source_1.ImageSource();
            if (utils_1.isFontIconURI(tabStripItem.iconSource)) {
                var fontIconCode = tabStripItem.iconSource.split("//")[1];
                var font = tabStripItem.style.fontInternal;
                var color = tabStripItem.style.color;
                is = image_source_1.fromFontIconCode(fontIconCode, font, color);
            }
            else {
                is = image_source_1.fromFileOrResource(tabStripItem.iconSource);
            }
            if (is) {
                tabItemSpec.iconDrawable = new android.graphics.drawable.BitmapDrawable(application.android.context.getResources(), is.android);
            }
            else {
            }
        }
    }
    return tabItemSpec;
}
var defaultAccentColor = undefined;
function getDefaultAccentColor(context) {
    if (defaultAccentColor === undefined) {
        defaultAccentColor = utils_1.ad.resources.getPaletteColor(ACCENT_COLOR, context) || 0xFF33B5E5;
    }
    return defaultAccentColor;
}
function setElevation(grid, tabLayout) {
    var compat = androidx.core.view.ViewCompat;
    if (compat.setElevation) {
        var val = DEFAULT_ELEVATION * utils_1.layout.getDisplayDensity();
        compat.setElevation(grid, val);
        compat.setElevation(tabLayout, val);
    }
}
exports.tabs = new Array();
function iterateIndexRange(index, eps, lastIndex, callback) {
    var rangeStart = Math.max(0, index - eps);
    var rangeEnd = Math.min(index + eps, lastIndex);
    for (var i = rangeStart; i <= rangeEnd; i++) {
        callback(i);
    }
}
var Tabs = (function (_super) {
    __extends(Tabs, _super);
    function Tabs() {
        var _this = _super.call(this) || this;
        _this._androidViewId = -1;
        exports.tabs.push(new WeakRef(_this));
        return _this;
    }
    Object.defineProperty(Tabs.prototype, "_hasFragments", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Tabs.prototype.onItemsChanged = function (oldItems, newItems) {
        _super.prototype.onItemsChanged.call(this, oldItems, newItems);
        if (oldItems) {
            oldItems.forEach(function (item, i, arr) {
                item.index = 0;
                item.tabItemSpec = null;
                item.setNativeView(null);
            });
        }
    };
    Tabs.prototype.createNativeView = function () {
        initializeNativeClasses();
        var context = this._context;
        var nativeView = new org.nativescript.widgets.GridLayout(context);
        var viewPager = new org.nativescript.widgets.TabViewPager(context);
        var tabLayout = new TabLayout(context, this);
        var lp = new org.nativescript.widgets.CommonLayoutParams();
        var primaryColor = utils_1.ad.resources.getPaletteColor(PRIMARY_COLOR, context);
        var accentColor = getDefaultAccentColor(context);
        lp.row = 1;
        if (this.tabsPosition === "top") {
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
            viewPager.setLayoutParams(lp);
        }
        else {
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
            tabLayout.setLayoutParams(lp);
        }
        nativeView.addView(viewPager);
        nativeView.viewPager = viewPager;
        var adapter = new PagerAdapter(this);
        viewPager.setAdapter(adapter);
        viewPager.adapter = adapter;
        nativeView.addView(tabLayout);
        nativeView.tabLayout = tabLayout;
        setElevation(nativeView, tabLayout);
        if (accentColor) {
            tabLayout.setSelectedIndicatorColors([accentColor]);
        }
        if (primaryColor) {
            tabLayout.setBackgroundColor(primaryColor);
        }
        return nativeView;
    };
    Tabs.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        var nativeView = this.nativeViewProtected;
        this._tabLayout = nativeView.tabLayout;
        var viewPager = nativeView.viewPager;
        viewPager.setId(this._androidViewId);
        this._viewPager = viewPager;
        this._pagerAdapter = viewPager.adapter;
        this._pagerAdapter.owner = this;
    };
    Tabs.prototype._loadUnloadTabItems = function (newIndex) {
        var _this = this;
        var items = this.items;
        var lastIndex = this.items.length - 1;
        var offsideItems = this.offscreenTabLimit;
        var toUnload = [];
        var toLoad = [];
        iterateIndexRange(newIndex, offsideItems, lastIndex, function (i) { return toLoad.push(i); });
        items.forEach(function (item, i) {
            var indexOfI = toLoad.indexOf(i);
            if (indexOfI < 0) {
                toUnload.push(i);
            }
        });
        toUnload.forEach(function (index) {
            var item = items[index];
            if (items[index]) {
                item.unloadView(item.view);
            }
        });
        var newItem = items[newIndex];
        var selectedView = newItem && newItem.view;
        if (selectedView instanceof frame_1.Frame) {
            selectedView._pushInFrameStackRecursive();
        }
        toLoad.forEach(function (index) {
            var item = items[index];
            if (_this.isLoaded && items[index]) {
                item.loadView(item.view);
            }
        });
    };
    Tabs.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.setItems(this.items);
        this.setTabStripItems(this.tabStrip.items);
    };
    Tabs.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        this.setItems(null);
        this.setTabStripItems(null);
    };
    Tabs.prototype.disposeNativeView = function () {
        this._tabLayout.setItems(null, null);
        this._pagerAdapter.owner = null;
        this._pagerAdapter = null;
        this._tabLayout = null;
        this._viewPager = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Tabs.prototype._onRootViewReset = function () {
        _super.prototype._onRootViewReset.call(this);
        this.disposeCurrentFragments();
    };
    Tabs.prototype.disposeCurrentFragments = function () {
        var fragmentManager = this._getFragmentManager();
        var transaction = fragmentManager.beginTransaction();
        for (var _i = 0, _a = fragmentManager.getFragments().toArray(); _i < _a.length; _i++) {
            var fragment = _a[_i];
            transaction.remove(fragment);
        }
        transaction.commitNowAllowingStateLoss();
    };
    Tabs.prototype.shouldUpdateAdapter = function (items) {
        if (!this._pagerAdapter) {
            return false;
        }
        var currentPagerAdapterItems = this._pagerAdapter.items;
        if (!items && !currentPagerAdapterItems) {
            return false;
        }
        if (!items || !currentPagerAdapterItems) {
            return true;
        }
        if (items.length !== currentPagerAdapterItems.length) {
            return true;
        }
        var matchingItems = currentPagerAdapterItems.filter(function (currentItem) {
            return !!items.filter(function (item) {
                return item._domId === currentItem._domId;
            })[0];
        });
        if (matchingItems.length !== items.length) {
            return true;
        }
        return false;
    };
    Tabs.prototype.setItems = function (items) {
        if (this.shouldUpdateAdapter(items)) {
            this._pagerAdapter.items = items;
            if (items && items.length) {
                items.forEach(function (item, i) {
                    item.index = i;
                });
            }
            this._pagerAdapter.notifyDataSetChanged();
        }
    };
    Tabs.prototype.setTabStripItems = function (items) {
        var length = items ? items.length : 0;
        if (length === 0) {
            this._tabLayout.setItems(null, null);
            return;
        }
        var tabItems = new Array();
        items.forEach(function (item, i, arr) {
            item.index = i;
            var tabItemSpec = createTabItemSpec(item);
            item.tabItemSpec = tabItemSpec;
            tabItems.push(tabItemSpec);
        });
        var tabLayout = this._tabLayout;
        tabLayout.setItems(tabItems, this._viewPager);
        this.tabStrip.setNativeView(tabLayout);
        items.forEach(function (item, i, arr) {
            var tv = tabLayout.getTextViewForItemAt(i);
            item.setNativeView(tv);
        });
    };
    Tabs.prototype.updateAndroidItemAt = function (index, spec) {
        this._tabLayout.updateItemAt(index, spec);
    };
    Tabs.prototype.getTabBarBackgroundColor = function () {
        return this._tabLayout.getBackground();
    };
    Tabs.prototype.setTabBarBackgroundColor = function (value) {
        if (value instanceof view_1.Color) {
            this._tabLayout.setBackgroundColor(value.android);
        }
        else {
            this._tabLayout.setBackground(tryCloneDrawable(value, this.nativeViewProtected.getResources));
        }
    };
    Tabs.prototype.getTabBarColor = function () {
        return this._tabLayout.getTabTextColor();
    };
    Tabs.prototype.setTabBarColor = function (value) {
        if (value instanceof view_1.Color) {
            this._tabLayout.setTabTextColor(value.android);
            this._tabLayout.setSelectedTabTextColor(value.android);
        }
        else {
            this._tabLayout.setTabTextColor(value);
            this._tabLayout.setSelectedTabTextColor(value);
        }
    };
    Tabs.prototype.getTabBarHighlightColor = function () {
        return getDefaultAccentColor(this._context);
    };
    Tabs.prototype.setTabBarHighlightColor = function (value) {
        var color = value instanceof view_1.Color ? value.android : value;
        this._tabLayout.setSelectedIndicatorColors([color]);
    };
    Tabs.prototype.setTabBarItemBackgroundColor = function (tabStripItem, value) {
        var tabStripItemIndex = this.tabStrip.items.indexOf(tabStripItem);
        var tabItemSpec = createTabItemSpec(tabStripItem);
        this.updateAndroidItemAt(tabStripItemIndex, tabItemSpec);
    };
    Tabs.prototype.getTabBarItemColor = function (tabStripItem) {
        return tabStripItem.nativeViewProtected.getCurrentTextColor();
    };
    Tabs.prototype.setTabBarItemColor = function (tabStripItem, value) {
        if (typeof value === "number") {
            tabStripItem.nativeViewProtected.setTextColor(value);
        }
        else {
            tabStripItem.nativeViewProtected.setTextColor(value.android);
        }
    };
    Tabs.prototype.getTabBarItemFontSize = function (tabStripItem) {
        return { nativeSize: tabStripItem.nativeViewProtected.getTextSize() };
    };
    Tabs.prototype.setTabBarItemFontSize = function (tabStripItem, value) {
        if (typeof value === "number") {
            tabStripItem.nativeViewProtected.setTextSize(value);
        }
        else {
            tabStripItem.nativeViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    };
    Tabs.prototype.getTabBarItemFontInternal = function (tabStripItem) {
        return tabStripItem.nativeViewProtected.getTypeface();
    };
    Tabs.prototype.setTabBarItemFontInternal = function (tabStripItem, value) {
        tabStripItem.nativeViewProtected.setTypeface(value instanceof font_1.Font ? value.getAndroidTypeface() : value);
    };
    Tabs.prototype.getTabBarItemTextTransform = function (tabStripItem) {
        return "default";
    };
    Tabs.prototype.setTabBarItemTextTransform = function (tabStripItem, value) {
        var tv = tabStripItem.nativeViewProtected;
        this._defaultTransformationMethod = this._defaultTransformationMethod || tv.getTransformationMethod();
        if (value === "default") {
            tv.setTransformationMethod(this._defaultTransformationMethod);
            tv.setText(tabStripItem.title);
        }
        else {
            var result = text_base_1.getTransformedText(tabStripItem.title, value);
            tv.setText(result);
            tv.setTransformationMethod(null);
        }
    };
    Tabs.prototype[tab_navigation_base_1.selectedIndexProperty.setNative] = function (value) {
        var smoothScroll = true;
        this._viewPager.setCurrentItem(value, smoothScroll);
    };
    Tabs.prototype[tab_navigation_base_1.itemsProperty.getDefault] = function () {
        return null;
    };
    Tabs.prototype[tab_navigation_base_1.itemsProperty.setNative] = function (value) {
        this.setItems(value);
        tab_navigation_base_1.selectedIndexProperty.coerce(this);
    };
    Tabs.prototype[tab_navigation_base_1.tabStripProperty.getDefault] = function () {
        return null;
    };
    Tabs.prototype[tab_navigation_base_1.tabStripProperty.setNative] = function (value) {
        this.setTabStripItems(value.items);
    };
    Tabs.prototype[tabs_common_1.swipeEnabledProperty.getDefault] = function () {
        return true;
    };
    Tabs.prototype[tabs_common_1.swipeEnabledProperty.setNative] = function (value) {
        this._viewPager.setSwipePageEnabled(value);
    };
    Tabs.prototype[tabs_common_1.offscreenTabLimitProperty.getDefault] = function () {
        return this._viewPager.getOffscreenPageLimit();
    };
    Tabs.prototype[tabs_common_1.offscreenTabLimitProperty.setNative] = function (value) {
        this._viewPager.setOffscreenPageLimit(value);
    };
    return Tabs;
}(tabs_common_1.TabsBase));
exports.Tabs = Tabs;
function tryCloneDrawable(value, resources) {
    if (value) {
        var constantState = value.getConstantState();
        if (constantState) {
            return constantState.newDrawable(resources);
        }
    }
    return value;
}
//# sourceMappingURL=tabs.android.js.map