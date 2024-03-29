Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../enums");
var trace_1 = require("../../trace");
var properties_1 = require("../core/properties");
var animation_1 = require("./animation");
var style_properties_1 = require("../styling/style-properties");
var Keyframes = (function () {
    function Keyframes() {
    }
    return Keyframes;
}());
exports.Keyframes = Keyframes;
var UnparsedKeyframe = (function () {
    function UnparsedKeyframe() {
    }
    return UnparsedKeyframe;
}());
exports.UnparsedKeyframe = UnparsedKeyframe;
var KeyframeDeclaration = (function () {
    function KeyframeDeclaration() {
    }
    return KeyframeDeclaration;
}());
exports.KeyframeDeclaration = KeyframeDeclaration;
var KeyframeInfo = (function () {
    function KeyframeInfo() {
        this.curve = enums_1.AnimationCurve.ease;
    }
    return KeyframeInfo;
}());
exports.KeyframeInfo = KeyframeInfo;
var KeyframeAnimationInfo = (function () {
    function KeyframeAnimationInfo() {
        this.name = "";
        this.duration = 0.3;
        this.delay = 0;
        this.iterations = 1;
        this.curve = "ease";
        this.isForwards = false;
        this.isReverse = false;
    }
    return KeyframeAnimationInfo;
}());
exports.KeyframeAnimationInfo = KeyframeAnimationInfo;
var KeyframeAnimation = (function () {
    function KeyframeAnimation() {
        this.delay = 0;
        this.iterations = 1;
    }
    KeyframeAnimation.keyframeAnimationFromInfo = function (info) {
        var length = info.keyframes.length;
        var animations = new Array();
        var startDuration = 0;
        if (info.isReverse) {
            for (var index = length - 1; index >= 0; index--) {
                var keyframe = info.keyframes[index];
                startDuration = KeyframeAnimation.parseKeyframe(info, keyframe, animations, startDuration);
            }
        }
        else {
            for (var index = 0; index < length; index++) {
                var keyframe = info.keyframes[index];
                startDuration = KeyframeAnimation.parseKeyframe(info, keyframe, animations, startDuration);
            }
            for (var index = length - 1; index > 0; index--) {
                var a1 = animations[index];
                var a2 = animations[index - 1];
                if (a2["curve"] !== undefined) {
                    a1["curve"] = a2["curve"];
                    a2["curve"] = undefined;
                }
            }
        }
        animations.map(function (a) { return a["curve"] ? a : Object.assign(a, { curve: info.curve }); });
        var animation = new KeyframeAnimation();
        animation.delay = info.delay;
        animation.iterations = info.iterations;
        animation.animations = animations;
        animation._isForwards = info.isForwards;
        return animation;
    };
    KeyframeAnimation.parseKeyframe = function (info, keyframe, animations, startDuration) {
        var animation = {};
        for (var _i = 0, _a = keyframe.declarations; _i < _a.length; _i++) {
            var declaration = _a[_i];
            animation[declaration.property] = declaration.value;
        }
        var duration = keyframe.duration;
        if (duration === 0) {
            duration = 0.01;
        }
        else {
            duration = (info.duration * duration) - startDuration;
            startDuration += duration;
        }
        animation.duration = info.isReverse ? info.duration - duration : duration;
        animation.curve = keyframe.curve;
        animation.forceLayer = true;
        animation.valueSource = "keyframe";
        animations.push(animation);
        return startDuration;
    };
    Object.defineProperty(KeyframeAnimation.prototype, "isPlaying", {
        get: function () {
            return this._isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    KeyframeAnimation.prototype.cancel = function () {
        if (!this.isPlaying) {
            trace_1.write("Keyframe animation is already playing.", trace_1.categories.Animation, trace_1.messageType.warn);
            return;
        }
        this._isPlaying = false;
        for (var i = this._nativeAnimations.length - 1; i >= 0; i--) {
            var animation = this._nativeAnimations[i];
            if (animation.isPlaying) {
                animation.cancel();
            }
        }
        if (this._nativeAnimations.length > 0) {
            var animation = this._nativeAnimations[0];
            this._resetAnimationValues(this._target, animation);
        }
        this._resetAnimations();
    };
    KeyframeAnimation.prototype.play = function (view) {
        var _this = this;
        if (this._isPlaying) {
            trace_1.write("Keyframe animation is already playing.", trace_1.categories.Animation, trace_1.messageType.warn);
            return new Promise(function (resolve) {
                resolve();
            });
        }
        var animationFinishedPromise = new Promise(function (resolve) {
            _this._resolve = resolve;
        });
        this._isPlaying = true;
        this._nativeAnimations = new Array();
        this._target = view;
        if (this.delay !== 0) {
            setTimeout(function () { return _this.animate(view, 0, _this.iterations); }, this.delay);
        }
        else {
            this.animate(view, 0, this.iterations);
        }
        return animationFinishedPromise;
    };
    KeyframeAnimation.prototype.animate = function (view, index, iterations) {
        var _this = this;
        if (!this._isPlaying) {
            return;
        }
        if (index === 0) {
            var animation = this.animations[0];
            if ("backgroundColor" in animation) {
                view.style[style_properties_1.backgroundColorProperty.keyframe] = animation.backgroundColor;
            }
            if ("scale" in animation) {
                view.style[style_properties_1.scaleXProperty.keyframe] = animation.scale.x;
                view.style[style_properties_1.scaleYProperty.keyframe] = animation.scale.y;
            }
            if ("translate" in animation) {
                view.style[style_properties_1.translateXProperty.keyframe] = animation.translate.x;
                view.style[style_properties_1.translateYProperty.keyframe] = animation.translate.y;
            }
            if ("rotate" in animation) {
                view.style[style_properties_1.rotateProperty.keyframe] = animation.rotate;
            }
            if ("opacity" in animation) {
                view.style[style_properties_1.opacityProperty.keyframe] = animation.opacity;
            }
            if ("height" in animation) {
                view.style[style_properties_1.heightProperty.keyframe] = animation.height;
            }
            if ("width" in animation) {
                view.style[style_properties_1.widthProperty.keyframe] = animation.width;
            }
            setTimeout(function () { return _this.animate(view, 1, iterations); }, 1);
        }
        else if (index < 0 || index >= this.animations.length) {
            iterations -= 1;
            if (iterations > 0) {
                this.animate(view, 0, iterations);
            }
            else {
                if (this._isForwards === false) {
                    var animation = this.animations[this.animations.length - 1];
                    this._resetAnimationValues(view, animation);
                }
                this._resolveAnimationFinishedPromise();
            }
        }
        else {
            var animation = void 0;
            var cachedAnimation = this._nativeAnimations[index - 1];
            if (cachedAnimation) {
                animation = cachedAnimation;
            }
            else {
                var animationDef = this.animations[index];
                animationDef.target = view;
                animation = new animation_1.Animation([animationDef]);
                this._nativeAnimations.push(animation);
            }
            var isLastIteration = iterations - 1 <= 0;
            animation.play(isLastIteration).then(function () {
                _this.animate(view, index + 1, iterations);
            }, function (error) {
                trace_1.write(typeof error === "string" ? error : error.message, trace_1.categories.Animation, trace_1.messageType.warn);
            }).catch(function (error) {
                trace_1.write(typeof error === "string" ? error : error.message, trace_1.categories.Animation, trace_1.messageType.warn);
            });
        }
    };
    KeyframeAnimation.prototype._resolveAnimationFinishedPromise = function () {
        this._nativeAnimations = new Array();
        this._isPlaying = false;
        this._target = null;
        this._resolve();
    };
    KeyframeAnimation.prototype._resetAnimations = function () {
        this._nativeAnimations = new Array();
        this._isPlaying = false;
        this._target = null;
    };
    KeyframeAnimation.prototype._resetAnimationValues = function (view, animation) {
        if ("backgroundColor" in animation) {
            view.style[style_properties_1.backgroundColorProperty.keyframe] = properties_1.unsetValue;
        }
        if ("scale" in animation) {
            view.style[style_properties_1.scaleXProperty.keyframe] = properties_1.unsetValue;
            view.style[style_properties_1.scaleYProperty.keyframe] = properties_1.unsetValue;
        }
        if ("translate" in animation) {
            view.style[style_properties_1.translateXProperty.keyframe] = properties_1.unsetValue;
            view.style[style_properties_1.translateYProperty.keyframe] = properties_1.unsetValue;
        }
        if ("rotate" in animation) {
            view.style[style_properties_1.rotateProperty.keyframe] = properties_1.unsetValue;
        }
        if ("opacity" in animation) {
            view.style[style_properties_1.opacityProperty.keyframe] = properties_1.unsetValue;
        }
        if ("height" in animation) {
            view.style[style_properties_1.heightProperty.keyframe] = properties_1.unsetValue;
        }
        if ("width" in animation) {
            view.style[style_properties_1.widthProperty.keyframe] = properties_1.unsetValue;
        }
    };
    return KeyframeAnimation;
}());
exports.KeyframeAnimation = KeyframeAnimation;
//# sourceMappingURL=keyframe-animation.js.map