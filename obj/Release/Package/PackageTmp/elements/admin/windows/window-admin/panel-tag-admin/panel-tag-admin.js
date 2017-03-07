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
var PanelTagAdmin = (function (_super) {
    __extends(PanelTagAdmin, _super);
    function PanelTagAdmin() {
        _super.apply(this, arguments);
    }
    PanelTagAdmin.prototype.selectedChanged = function () {
        if (this.selected && !this.tags) {
            this.tags = [];
            this.sortOnName();
            this.categories = [];
            for (var i = 0; i < HaTag.categoryNames.length; i++)
                if (i != 3 && i != 6)
                    this.push('categories', { id: i, name: HaTag.categoryNames[i] });
            this.set('categoryIndex', 7);
        }
    };
    PanelTagAdmin.prototype.filterCheckForEnter = function (e) {
        if (e.keyCode === 13)
            this.fetchTags();
    };
    PanelTagAdmin.prototype.categoryIndexChanged = function () {
        this.tags = [];
        this.fetchTags();
    };
    PanelTagAdmin.prototype.fetchTags = function () {
        var _this = this;
        Services.get('tags', {
            'schema': '{tag:{fields:[id,plurname,category],filters:{' + (this.filter ? 'plurname:{like:' + this.filter + '},' : '') + 'category:' + this.categories[this.categoryIndex].id + '}}}',
            'count': 'all'
        }, function (result) {
            _this.updateTags(result.data);
        });
    };
    PanelTagAdmin.prototype.updateTags = function (newList) {
        if (newList === void 0) { newList = null; }
        this.$.admin.sort(null, newList);
    };
    PanelTagAdmin.prototype.itemTap = function (e) {
        this.$.admin.select(e.model.item);
    };
    PanelTagAdmin.prototype.getTag = function () {
        var _this = this;
        if (!this.tag)
            return;
        Services.get('tag', {
            'schema': '{tag:[singname,{children:[{child:[id,plurname]}]},{parents:[{parent:[id,plurname]}]}]}',
            'id': this.tag.id
        }, function (result) {
            for (var attr in result.data[0])
                _this.set('tag.' + attr, result.data[0][attr]);
        });
    };
    PanelTagAdmin.prototype.categoryName = function (category) {
        return HaTag.categoryNames[category];
    };
    PanelTagAdmin.prototype.getAutosuggestSchema = function (children) {
        if (!children)
            return;
        var existingIds = [];
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var item = children_1[_i];
            existingIds.push(item.child.id);
        }
        return '{tag:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},category:' + this.tag.category + ',plurname:{like:$input}},fields:[id,plurname]}}';
    };
    PanelTagAdmin.prototype.sortOnName = function () {
        this.$.admin.sort(this.compareName);
    };
    PanelTagAdmin.prototype.compareName = function (a, b) {
        return a.plurname.localeCompare(b.plurname);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelTagAdmin.prototype, "tags", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], PanelTagAdmin.prototype, "tag", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], PanelTagAdmin.prototype, "filter", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelTagAdmin.prototype, "categories", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], PanelTagAdmin.prototype, "categoryIndex", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelTagAdmin.prototype, "selected", void 0);
    __decorate([
        observe('selected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelTagAdmin.prototype, "selectedChanged", null);
    __decorate([
        observe('categoryIndex'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelTagAdmin.prototype, "categoryIndexChanged", null);
    __decorate([
        observe('tag'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelTagAdmin.prototype, "getTag", null);
    PanelTagAdmin = __decorate([
        component("panel-tag-admin"), 
        __metadata('design:paramtypes', [])
    ], PanelTagAdmin);
    return PanelTagAdmin;
}(polymer.Base));
PanelTagAdmin.register();
