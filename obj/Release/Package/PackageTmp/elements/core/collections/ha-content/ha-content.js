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
var HaContentService = (function (_super) {
    __extends(HaContentService, _super);
    function HaContentService() {
        _super.apply(this, arguments);
    }
    HaContentService.prototype.contentChanged = function (changeRecord) {
        var _this = this;
        var props = changeRecord.path.split('.');
        var property = props.pop();
        if (props.length == 1) {
            if (property == 'headline')
                this.set('content.texts.0.headline', changeRecord.value);
            else
                this.content.update(property);
        }
        if (props.length == 2 && property == 'splices') {
            var splice = changeRecord.value.indexSplices[0];
            //TODO: Multiple adds??
            if (splice.addedCount > 0)
                (splice.object[splice.index]).insert(function (propsReturned) {
                    for (var _i = 0, propsReturned_1 = propsReturned; _i < propsReturned_1.length; _i++) {
                        var propReturned = propsReturned_1[_i];
                        //var test = props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned;
                        //var value = splice.object[splice.index][propReturned];
                        //this.notifyPath(props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned, splice.object[splice.index][propReturned]);
                        _this.notifyPath(props[0] + '.' + props[1] + '.' + splice.index + '.' + propReturned, splice.object[splice.index][propReturned]);
                    }
                }); //TODO: notify changes in callback when new values are returned (created, id and user)
            for (var _i = 0, _a = splice.removed; _i < _a.length; _i++) {
                var subcontent = _a[_i];
                subcontent.delete();
            }
        }
        if (props.length == 3)
            this.content[props[1]][props[2].substring(1)].update(property);
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaContent)
    ], HaContentService.prototype, "content", void 0);
    __decorate([
        observe("content.*"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaContentService.prototype, "contentChanged", null);
    HaContentService = __decorate([
        component("ha-content"), 
        __metadata('design:paramtypes', [])
    ], HaContentService);
    return HaContentService;
}(polymer.Base));
HaContentService.register();
//# sourceMappingURL=ha-content.js.map