function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_base_1 = require("../text-base");
__export(require("../text-base"));
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._focusHandler = function () { return _this._goToVisualState("focus"); };
        _this._blurHandler = function () { return _this._goToVisualState("blur"); };
        return _this;
    }
    EditableTextBase.prototype._updateTextBaseFocusStateHandler = function (subscribe) {
        var method = subscribe ? "on" : "off";
        this[method]("focus", this._focusHandler);
        this[method]("blur", this._blurHandler);
    };
    EditableTextBase.blurEvent = "blur";
    EditableTextBase.focusEvent = "focus";
    EditableTextBase.textChangeEvent = "textChange";
    __decorate([
        text_base_1.PseudoClassHandler("focus", "blur")
    ], EditableTextBase.prototype, "_updateTextBaseFocusStateHandler", null);
    return EditableTextBase;
}(text_base_1.TextBase));
exports.EditableTextBase = EditableTextBase;
exports.placeholderColorProperty = new text_base_1.CssProperty({ name: "placeholderColor", cssName: "placeholder-color", equalityComparer: text_base_1.Color.equals, valueConverter: function (v) { return new text_base_1.Color(v); } });
exports.placeholderColorProperty.register(text_base_1.Style);
var keyboardTypeConverter = text_base_1.makeParser(text_base_1.makeValidator("datetime", "phone", "number", "url", "email"));
exports.keyboardTypeProperty = new text_base_1.Property({ name: "keyboardType", valueConverter: keyboardTypeConverter });
exports.keyboardTypeProperty.register(EditableTextBase);
var returnKeyTypeConverter = text_base_1.makeParser(text_base_1.makeValidator("done", "next", "go", "search", "send"));
exports.returnKeyTypeProperty = new text_base_1.Property({ name: "returnKeyType", valueConverter: returnKeyTypeConverter });
exports.returnKeyTypeProperty.register(EditableTextBase);
exports.editableProperty = new text_base_1.Property({ name: "editable", defaultValue: true, valueConverter: text_base_1.booleanConverter });
exports.editableProperty.register(EditableTextBase);
exports.updateTextTriggerProperty = new text_base_1.Property({ name: "updateTextTrigger", defaultValue: "textChanged" });
exports.updateTextTriggerProperty.register(EditableTextBase);
var autocapitalizationTypeConverter = text_base_1.makeParser(text_base_1.makeValidator("none", "words", "sentences", "allcharacters"));
exports.autocapitalizationTypeProperty = new text_base_1.Property({ name: "autocapitalizationType", defaultValue: "sentences", valueConverter: autocapitalizationTypeConverter });
exports.autocapitalizationTypeProperty.register(EditableTextBase);
exports.autocorrectProperty = new text_base_1.Property({ name: "autocorrect", valueConverter: text_base_1.booleanConverter });
exports.autocorrectProperty.register(EditableTextBase);
exports.hintProperty = new text_base_1.Property({ name: "hint", defaultValue: "" });
exports.hintProperty.register(EditableTextBase);
exports.maxLengthProperty = new text_base_1.Property({ name: "maxLength", defaultValue: Number.POSITIVE_INFINITY, valueConverter: parseInt });
exports.maxLengthProperty.register(EditableTextBase);
//# sourceMappingURL=editable-text-base-common.js.map