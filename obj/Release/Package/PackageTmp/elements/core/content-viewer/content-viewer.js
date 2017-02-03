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
var ContentViewer = (function (_super) {
    __extends(ContentViewer, _super);
    function ContentViewer() {
        _super.apply(this, arguments);
    }
    ContentViewer.contentSchema = '{content:[id,geoid,ordering,deleted,contenttypeid,{texts:[empty,id,created,{user:[firstname,lastname]},headline,text1]},{biblios:[empty,id,created,cql]},{externalcontent:[empty,id,created,externalsourceid,text,link]},{tag_contents:[{collapse:tagid}]}]}';
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaContent)
    ], ContentViewer.prototype, "content", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], ContentViewer.prototype, "editing", void 0);
    ContentViewer = __decorate([
        component("content-viewer"), 
        __metadata('design:paramtypes', [])
    ], ContentViewer);
    return ContentViewer;
}(polymer.Base));
ContentViewer.register();
