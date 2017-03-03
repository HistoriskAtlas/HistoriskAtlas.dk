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
var WindowGeoBiblio = (function (_super) {
    __extends(WindowGeoBiblio, _super);
    function WindowGeoBiblio() {
        _super.apply(this, arguments);
    }
    WindowGeoBiblio.prototype.cqlChanged = function () {
        //if (!this.geo.id)
        //    return;
        this.immediatecql = this.cql;
        this.set('params', {
            'cql': this.cql
        });
        if (!this._closingItem) {
            this.searching = true;
            this.biblios = null;
        }
        this._closingItem = false;
        if (!this.url)
            this.url = 'http://' + (Common.isDevOrBeta ? 'beta.' : '') + 'historiskatlas.dk/proxy/biblio.json';
        this.$.ajax.generateRequest();
    };
    WindowGeoBiblio.prototype.search = function () {
        this.set('cql', this.immediatecql);
    };
    WindowGeoBiblio.prototype.handleResponse = function () {
        this.searching = false;
        var data = this.$.ajax.lastResponse;
        this.biblios = data.biblios;
    };
    WindowGeoBiblio.prototype.secondLine = function (creator, date, format) {
        var line = [];
        if (creator)
            line.push(creator);
        if (date)
            line.push(date);
        if (format)
            line.push(format);
        return line.join(' - ');
    };
    WindowGeoBiblio.prototype.biblioTap = function (e) {
        var biblio = e.model.biblio;
        window.open(biblio.url, '_blank');
    };
    WindowGeoBiblio.prototype.closeTap = function (e) {
        e.stopPropagation();
        var biblio = this.$.biblioRepeat.modelForElement(e.currentTarget).biblio;
        var ids = [];
        if (biblio.identifiers.length == 0)
            ids.push(biblio.id.split('|')[0]);
        else
            for (var _i = 0, _a = biblio.identifiers; _i < _a.length; _i++) {
                var identifier = _a[_i];
                ids.push(identifier.split(':')[1]);
            }
        var idString = ids.join(' or ');
        this._closingItem = true;
        this.splice('biblios', this.biblios.indexOf(biblio), 1);
        this.cql = (/not rec\.id = \(.*\)$/g).test(this.cql) ? this.cql.slice(0, -1) + ' or ' + idString + ')' : '(' + this.cql + ') not rec.id = (' + idString + ')';
    };
    WindowGeoBiblio.prototype.toggleIcon = function (showCql) {
        return showCql ? 'remove' : 'add';
    };
    WindowGeoBiblio.prototype.toggleCqlTap = function () {
        this.showCql = !this.showCql;
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], WindowGeoBiblio.prototype, "url", void 0);
    __decorate([
        property({ type: String, notify: true }), 
        __metadata('design:type', String)
    ], WindowGeoBiblio.prototype, "cql", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], WindowGeoBiblio.prototype, "immediatecql", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowGeoBiblio.prototype, "searching", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowGeoBiblio.prototype, "editing", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], WindowGeoBiblio.prototype, "params", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowGeoBiblio.prototype, "biblios", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], WindowGeoBiblio.prototype, "showCql", void 0);
    __decorate([
        observe("cql"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowGeoBiblio.prototype, "cqlChanged", null);
    WindowGeoBiblio = __decorate([
        component("window-geo-biblio"), 
        __metadata('design:paramtypes', [])
    ], WindowGeoBiblio);
    return WindowGeoBiblio;
}(polymer.Base));
var Biblio = (function () {
    function Biblio() {
    }
    return Biblio;
}());
WindowGeoBiblio.register();
//# sourceMappingURL=window-geo-biblio.js.map