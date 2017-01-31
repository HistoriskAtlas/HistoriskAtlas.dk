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
var WindowUserNews = (function (_super) {
    __extends(WindowUserNews, _super);
    function WindowUserNews() {
        _super.apply(this, arguments);
    }
    WindowUserNews.lastUpdate = new Date(2016, 11, 19, 15, 0); //remember: zero based month index
    WindowUserNews = __decorate([
        component("window-user-news"), 
        __metadata('design:paramtypes', [])
    ], WindowUserNews);
    return WindowUserNews;
}(polymer.Base));
WindowUserNews.register();
//# sourceMappingURL=window-user-news.js.map