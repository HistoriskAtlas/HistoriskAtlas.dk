var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TimeWarpButton = (function (_super) {
    __extends(TimeWarpButton, _super);
    function TimeWarpButton() {
        _super.call(this);
        //this.update();
        //this.show();
        $(this.domHost).css('opacity', 0);
    }
    TimeWarpButton.prototype.buttonTap = function (e) {
        e.preventDefault();
        this.fire('buttonOnlyTap');
    };
    TimeWarpButton.prototype.hasIcon = function (icon) {
        return !!icon;
    };
    TimeWarpButton.prototype.show = function () {
        $(this.domHost).css('transition', TimeWarpButton.transitionAfterMove);
        $(this.domHost).css('opacity', 1);
    };
    TimeWarpButton.prototype.hide = function () {
        $(this.domHost).css('opacity', 0);
    };
    TimeWarpButton.prototype.update = function () {
        var dom = $(this.domHost);
        this.mode = App.map.timeWarp.mode;
        if (App.map.timeWarp.dragMode != this.lastDragMode) {
            dom.css('transition', App.map.timeWarp.dragMode == TimeWarpDragModes.NONE ? TimeWarpButton.transitionAfterMove : TimeWarpButton.transitionBeforeMove);
            dom.css('opacity', App.map.timeWarp.dragMode == TimeWarpDragModes.NONE ? '1.0' : '0.0');
            this.lastDragMode = App.map.timeWarp.dragMode;
        }
        if (this.mode == TimeWarpModes.MORPH) {
            if (this.lastMode == TimeWarpModes.SPLIT)
                dom.css('transition', TimeWarpButton.transitionMorph);
            if (this.lastMode == TimeWarpModes.CIRCLE) {
                dom.css('transition', TimeWarpButton.transitionMorph);
                dom.css('right', this.maxX);
                dom.css('top', this.radian ? this.minY : this.maxYCalc);
            }
        }
        if (this.mode == TimeWarpModes.CIRCLE || (this.mode == TimeWarpModes.MORPH && this.lastMode == TimeWarpModes.SPLIT)) {
            var x = this.radian ? Common.dom.width() - (App.map.timeWarp.position[0] + 20 + Math.cos(TimeWarpButton.radian + this.radian / App.map.timeWarp.radius) * App.map.timeWarp.radius) : Common.dom.width() - (App.map.timeWarp.position[0] + dom.width() / 2);
            var y = this.radian ? App.map.timeWarp.position[1] - 20 + Math.sin(TimeWarpButton.radian + this.radian / App.map.timeWarp.radius) * App.map.timeWarp.radius : App.map.timeWarp.position[1] + App.map.timeWarp.radius - 20;
            //dom.css('right', Math.max(x, this.maxX));
            //dom.css('top', this.radian ? Math.max(y, this.minY) : (y > this.maxY ? this.maxYCalc : y));
            dom.css('right', x);
            dom.css('top', y);
        }
        this.lastMode = this.mode;
    };
    Object.defineProperty(TimeWarpButton.prototype, "maxX", {
        get: function () {
            return this.radian ? 10 : 60;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeWarpButton.prototype, "minY", {
        get: function () {
            //return 10 + (this.radian > 0 ? 45 : 0);
            return 10 + (this.radian + 44);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeWarpButton.prototype, "maxY", {
        get: function () {
            return App.map.getSize()[1] - 46 - (this.lift ? 100 : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeWarpButton.prototype, "maxYCalc", {
        get: function () {
            return 'calc(100% - ' + (46 + (this.lift ? 100 : 0)) + 'px)';
        },
        enumerable: true,
        configurable: true
    });
    TimeWarpButton.updateTimeWarpUI = function () {
        if (!this.allTimeWarpButtons)
            return;
        for (var _i = 0, _a = this.allTimeWarpButtons; _i < _a.length; _i++) {
            var button = _a[_i];
            button.update();
        }
    };
    TimeWarpButton.showTimeWarpUI = function () {
        if (!this.allTimeWarpButtons)
            return;
        for (var _i = 0, _a = this.allTimeWarpButtons; _i < _a.length; _i++) {
            var button = _a[_i];
            button.show();
        }
    };
    TimeWarpButton.hideTimeWarpUI = function () {
        if (!this.allTimeWarpButtons)
            return;
        for (var _i = 0, _a = this.allTimeWarpButtons; _i < _a.length; _i++) {
            var button = _a[_i];
            button.hide();
        }
    };
    Object.defineProperty(TimeWarpButton, "allTimeWarpButtons", {
        get: function () {
            if (this._allTimeWarpButtons)
                return this._allTimeWarpButtons;
            var test = document.querySelector('time-warp-shape-button');
            if (!document.querySelector('time-warp-shape-button'))
                return null;
            this._allTimeWarpButtons = [];
            this._allTimeWarpButtons.push(document.querySelector('time-warp-close-button'));
            this._allTimeWarpButtons.push(document.querySelector('time-warp-shape-button'));
            this._allTimeWarpButtons.push(document.querySelector('time-warp-opacity-button'));
            this._allTimeWarpButtons.push(document.querySelector('time-warp-map-button'));
            return this._allTimeWarpButtons;
        },
        enumerable: true,
        configurable: true
    });
    TimeWarpButton.radian = Math.PI * (7 / 4);
    TimeWarpButton.transitionMorph = 'right .4s cubic-bezier(0.42,0,0.42,1), top .4s cubic-bezier(0.42,0,0.42,1), height 0.3s';
    TimeWarpButton.transitionBeforeMove = 'opacity 1s ease 1s, height 0.3s';
    TimeWarpButton.transitionAfterMove = 'opacity 0.5s ease, height 0.3s';
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Object)
    ], TimeWarpButton.prototype, "mode", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], TimeWarpButton.prototype, "radian", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeWarpButton.prototype, "lift", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], TimeWarpButton.prototype, "icon", void 0);
    TimeWarpButton = __decorate([
        component("time-warp-button"), 
        __metadata('design:paramtypes', [])
    ], TimeWarpButton);
    return TimeWarpButton;
}(polymer.Base));
TimeWarpButton.register();
//# sourceMappingURL=time-warp-button.js.map