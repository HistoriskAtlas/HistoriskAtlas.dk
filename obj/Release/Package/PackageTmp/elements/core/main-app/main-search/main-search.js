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
var MainSearch = (function (_super) {
    __extends(MainSearch, _super);
    function MainSearch() {
        _super.apply(this, arguments);
    }
    MainSearch.prototype.searchIconTap = function () {
        if (!this.open) {
            this.open = true;
            $(this.$.searchInput).focus();
        }
        else
            this.doSearch(this.$.searchInput.value);
    };
    MainSearch.prototype.containerClass = function (open) {
        return open ? 'expanded' : '';
    };
    MainSearch.prototype.searchCloseTap = function () {
        this.doSearch(null);
    };
    MainSearch.prototype.searchInputKeyup = function (e) {
        if (e.keyCode == 13) {
            $(this.$.searchInput).blur();
            this.doSearch(this.$.searchInput.value);
        }
    };
    MainSearch.prototype.openChanged = function () {
        if (this.open)
            $(this).addClass('expanded');
        else
            $(this).removeClass('expanded');
    };
    MainSearch.prototype.doSearch = function (value) {
        var _this = this;
        this.open = false;
        setTimeout(function () { return _this.$.searchInput.value = ''; }, 300);
        if (!value)
            return;
        switch (value) {
            case 'devtools':
                Common.dom.append(WindowDev.create());
                break;
            default:
                Common.dom.append(WindowSearch.create(value));
                break;
        }
    };
    __decorate([
        property({ type: Boolean, notify: true, value: false }), 
        __metadata('design:type', Boolean)
    ], MainSearch.prototype, "open", void 0);
    __decorate([
        listen("searchInput.keyup"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], MainSearch.prototype, "searchInputKeyup", null);
    __decorate([
        observe('open'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MainSearch.prototype, "openChanged", null);
    MainSearch = __decorate([
        component("main-search"), 
        __metadata('design:paramtypes', [])
    ], MainSearch);
    return MainSearch;
}(polymer.Base));
MainSearch.register();
//# sourceMappingURL=main-search.js.map