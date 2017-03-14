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
var HaContents = (function (_super) {
    __extends(HaContents, _super);
    function HaContents() {
        _super.apply(this, arguments);
    }
    HaContents.prototype.ready = function () {
        this.$.ajax.url = Common.api + 'content.json';
    };
    HaContents.prototype.geoChanged = function (newVal, oldVal) {
        if (!this.geo.id)
            return;
        this.set('params', {
            'geoid': this.geo.id,
            'count': 'all',
            'schema': ContentViewer.contentSchema
        });
        this.$.ajax.generateRequest();
    };
    HaContents.prototype.handleResponse = function () {
        var newContents = [];
        var newContent;
        this.$.ajax.lastResponse.forEach(function (data) {
            newContents.push(new HaContent(data));
        });
        this.contents = newContents;
    };
    HaContents.prototype.contentsChanged = function (changeRecord) {
        var props = changeRecord.path.split('.');
        var property = props.pop();
        if (props.length == 0) {
            this.selectSubContents();
            return;
        }
        if (props.length == 1) {
            if (property == 'splices') {
                this.selectSubContents();
                var splice = changeRecord.value.indexSplices[0];
                //TODO: Multiple adds??
                if (splice.addedCount > 0)
                    splice.object[splice.index].insert();
                for (var _i = 0, _a = splice.removed; _i < _a.length; _i++) {
                    var content = _a[_i];
                    content.delete();
                }
            }
            return;
        }
        //var content: HaContent = this.contents[props[1].substring(1)];
        //if (props.length == 2)
        //    content.update(property);
        //if (props.length == 3 && property == 'splices') { //SubContent inserted...
        //    var splice = changeRecord.value.indexSplices[0];
        //    //TODO: Multiple adds??
        //    if (splice.addedCount > 0)
        //        (splice.object[splice.index]).insert((propsReturned: Array<string>) => {
        //            for (var propReturned of propsReturned) {
        //                //var test = props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned;
        //                //var value = splice.object[splice.index][propReturned];
        //                this.notifyPath(props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned, splice.object[splice.index][propReturned]);
        //                //this.set(props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned, propsReturned[propReturned]);
        //            }
        //        }); //TODO: notify changes in callback when new values are returned (created, id and user)
        //    for (var subcontent of splice.removed)
        //        subcontent.delete();
        //}
        //if (props.length == 4)
        //    content[props[2]][props[3].substring(1)].update(property);
    };
    HaContents.prototype.selectSubContents = function () {
        this.$.selectorEditorialContent.select(this.contents.filter(function (content) { return content.isEditorial; }).pop());
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaContents.prototype, "geo", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaContents.prototype, "contents", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaContent)
    ], HaContents.prototype, "editorialContent", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaContents.prototype, "params", void 0);
    __decorate([
        observe("geo"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Number, Number]), 
        __metadata('design:returntype', void 0)
    ], HaContents.prototype, "geoChanged", null);
    __decorate([
        observe("contents.*"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaContents.prototype, "contentsChanged", null);
    HaContents = __decorate([
        component("ha-contents"), 
        __metadata('design:paramtypes', [])
    ], HaContents);
    return HaContents;
}(polymer.Base));
HaContents.register();
//# sourceMappingURL=ha-contents.js.map