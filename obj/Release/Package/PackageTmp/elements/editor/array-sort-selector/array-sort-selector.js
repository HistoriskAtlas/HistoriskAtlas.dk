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
var ArraySortSelcetor = (function (_super) {
    __extends(ArraySortSelcetor, _super);
    function ArraySortSelcetor() {
        _super.apply(this, arguments);
        this.compareDir = 1;
    }
    ArraySortSelcetor.prototype.select = function (item) {
        this.$.selector.select(item);
    };
    ArraySortSelcetor.prototype.deselect = function (item) {
        this.$.selector.deselect(item);
    };
    ArraySortSelcetor.prototype.sort = function (func, newItems) {
        if (func === void 0) { func = null; }
        if (newItems === void 0) { newItems = null; }
        if (func) {
            if (this.compareFunc === func)
                this.compareDir = -this.compareDir;
            else {
                this.compareDir = 1;
                this.compareFunc = func;
            }
        }
        var temp = (newItems ? newItems : this.items.slice(0)).sort(this.compareFunc);
        if (this.compareDir == -1)
            temp = temp.reverse();
        this.items = temp;
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], ArraySortSelcetor.prototype, "items", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], ArraySortSelcetor.prototype, "selected", void 0);
    ArraySortSelcetor = __decorate([
        component("array-sort-selector"), 
        __metadata('design:paramtypes', [])
    ], ArraySortSelcetor);
    return ArraySortSelcetor;
}(polymer.Base));
ArraySortSelcetor.register();
//# sourceMappingURL=array-sort-selector.js.map