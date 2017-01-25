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
var PanelDigDag = (function (_super) {
    __extends(PanelDigDag, _super);
    function PanelDigDag() {
        _super.apply(this, arguments);
    }
    PanelDigDag.prototype.digdagTap = function (e) {
        e.model.set('digdag.showChildren', !e.model.digdag.showChildren);
    };
    PanelDigDag.prototype.childTap = function (e) {
        e.model.set('child.active', true);
        this.update(e.model.child);
        this.type = e.model.child;
        clearTimeout(this.childDownTimeout);
    };
    PanelDigDag.prototype.childDown = function (e) {
        if (this.touchDevice && e.model.child.regionTypeCategory.id != 7)
            this.childDownTimeout = setTimeout(function () { return Common.dom.append(WindowRegionType.create(e.model.child)); }, 750);
    };
    PanelDigDag.prototype.infoTap = function (e) {
        Common.dom.append(WindowRegionType.create(e.model.child));
        e.cancelBubble = true;
    };
    PanelDigDag.prototype.disabledTap = function () {
        if (this.type == null)
            return;
        this.update(null);
        this.type = null;
        App.map.hideDigDagLayer();
    };
    PanelDigDag.prototype.years = function (start, end) {
        return Common.years(start, end);
    };
    PanelDigDag.prototype.disabled = function (type) {
        return type == null;
    };
    PanelDigDag.prototype.showInfoButton = function (touchDevice, digdag) {
        return !touchDevice && digdag.id != 7;
    };
    PanelDigDag.prototype.classListItem = function (year, regionType) {
        return 'listitem listsubitem noselect' + ((year < regionType.periodStart || year > regionType.periodEnd) ? ' inactive' : '');
    };
    PanelDigDag.prototype.update = function (activeRegionType) {
        var _this = this;
        if (activeRegionType)
            App.map.showDigDagLayer(activeRegionType.name);
        this.digdags.forEach(function (digdag, i) {
            return digdag.regionTypes.forEach(function (regionType, j) {
                if (regionType != activeRegionType)
                    _this.set('digdags.' + i + '.regionTypes.' + j + '.active', false);
            });
        });
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelDigDag.prototype, "digdags", void 0);
    __decorate([
        property({ type: Object, notify: true, value: null }), 
        __metadata('design:type', Object)
    ], PanelDigDag.prototype, "type", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], PanelDigDag.prototype, "year", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelDigDag.prototype, "touchDevice", void 0);
    PanelDigDag = __decorate([
        component("panel-digdag"), 
        __metadata('design:paramtypes', [])
    ], PanelDigDag);
    return PanelDigDag;
}(polymer.Base));
PanelDigDag.register();
