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
var Tags = (function (_super) {
    __extends(Tags, _super);
    function Tags() {
        _super.apply(this, arguments);
    }
    Tags.prototype.initTags = function (tagRelationName, subProperty) {
        this.tagRelationName = tagRelationName;
        this.subProperty = subProperty;
        for (var _i = 0, _a = Tags.categoryNames; _i < _a.length; _i++) {
            var categoryName = _a[_i];
            if (categoryName)
                this.set(categoryName, []);
        }
        this.licens = null;
        for (var _b = 0, _c = this[this.tagRelationName].tags; _b < _c.length; _b++) {
            var tag = _c[_b];
            this.addTag(tag, false, false);
        }
    };
    Tags.prototype.addTagById = function (tagId, addToBaseArray, save) {
        var _this = this;
        if (typeof App == 'undefined') {
            Services.get('tag', {
                schema: Common.apiSchemaTags,
                id: tagId
            }, function (result) {
                _this.addTag(new HaTag(result.data[0]), addToBaseArray, save);
            });
        }
        else
            this.addTag(App.haTags.byId[tagId], addToBaseArray, save);
    };
    Tags.prototype.addTag = function (tag, addToBaseArray, save) {
        if (addToBaseArray)
            if (this[this.tagRelationName].tags.indexOf(tag) > -1)
                return false;
        if (tag.category == 4) {
            if (this.licens && save)
                this.removeTagById(this.licens.tagID);
            this.set('licens', document.querySelector('ha-licenses').byTagID[tag.id]);
        }
        if (addToBaseArray)
            this.push(this.tagRelationName + '.tags', tag);
        if (Tags.categoryNames[tag.category])
            this.push(Tags.categoryNames[tag.category], tag);
        if (save)
            Services.insert('tag_' + this.propertyName(), JSON.parse('{ "tagid": ' + tag.id + ', "' + this.propertyName() + 'id": ' + this.propertyId() + ' }'));
        return true;
    };
    Tags.prototype.removeTagById = function (tagId) {
        for (var _i = 0, _a = this[this.tagRelationName].tags; _i < _a.length; _i++) {
            var tag = _a[_i];
            if (tag.id == tagId) {
                this.removeTag(tag);
                return;
            }
        }
    };
    Tags.prototype.removeTag = function (tag) {
        this.splice(this.tagRelationName + '.tags', this[this.tagRelationName].tags.indexOf(tag), 1);
        if (Tags.categoryNames[tag.category])
            this.splice(Tags.categoryNames[tag.category], this[Tags.categoryNames[tag.category]].indexOf(tag), 1);
        Services.delete('tag_' + this.propertyName(), JSON.parse('{ "tagid": ' + tag.id + ', "' + this.propertyName() + 'id": ' + this.propertyId() + ', "deletemode": "permanent" }'));
    };
    Tags.prototype.propertyName = function () {
        return this.subProperty ? this.subProperty : this.tagRelationName;
    };
    Tags.prototype.propertyId = function () {
        return (this.subProperty ? this[this.tagRelationName][this.subProperty] : this[this.tagRelationName]).id;
    };
    Tags.categoryNames = [, , , 'institutions', , , , , 'destinations', 'subjects', 'periods'];
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], Tags.prototype, "subjects", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], Tags.prototype, "periods", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], Tags.prototype, "institutions", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], Tags.prototype, "destinations", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaLicens)
    ], Tags.prototype, "licens", void 0);
    return Tags;
}(polymer.Base));
