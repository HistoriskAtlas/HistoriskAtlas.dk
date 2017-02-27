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
var MainMenuItem = (function (_super) {
    __extends(MainMenuItem, _super);
    function MainMenuItem() {
        _super.apply(this, arguments);
    }
    MainMenuItem.prototype.showMenuItem = function (showMainMenu, show) {
        return showMainMenu || show;
    };
    MainMenuItem.prototype.immediateShowChanged = function (newVal) {
        this.showMainMenu = !newVal;
        this.show = newVal;
    };
    MainMenuItem.prototype.showChanged = function (newVal) {
        this.immediateShow = newVal;
        if (newVal)
            this.fire('shown');
    };
    //@observe('showMainMenu')
    //showMainMenuChanged() {
    //    if (this.showMainMenu)
    //        this.show = false;
    //}
    MainMenuItem.prototype.leftIcon = function (show) {
        return show ? 'chevron-left' : this.icon;
    };
    MainMenuItem.prototype.rightIcon = function (show) {
        return show ? 'help-outline' : 'chevron-right';
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], MainMenuItem.prototype, "title", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], MainMenuItem.prototype, "icon", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], MainMenuItem.prototype, "show", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], MainMenuItem.prototype, "immediateShow", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], MainMenuItem.prototype, "showMainMenu", void 0);
    __decorate([
        observe('immediateShow'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean]), 
        __metadata('design:returntype', void 0)
    ], MainMenuItem.prototype, "immediateShowChanged", null);
    __decorate([
        observe('show'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean]), 
        __metadata('design:returntype', void 0)
    ], MainMenuItem.prototype, "showChanged", null);
    MainMenuItem = __decorate([
        component("main-menu-item"), 
        __metadata('design:paramtypes', [])
    ], MainMenuItem);
    return MainMenuItem;
}(polymer.Base));
MainMenuItem.register();
//# sourceMappingURL=main-menu-item.js.map