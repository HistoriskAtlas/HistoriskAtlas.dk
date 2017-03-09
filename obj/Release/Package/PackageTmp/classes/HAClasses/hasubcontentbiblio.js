var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HaSubContentBiblio = (function (_super) {
    __extends(HaSubContentBiblio, _super);
    function HaSubContentBiblio(data, content) {
        _super.call(this, data, content);
        this._cql = data.cql;
    }
    Object.defineProperty(HaSubContentBiblio.prototype, "cql", {
        get: function () {
            return this._cql;
        },
        set: function (value) {
            this._cql = value;
        },
        enumerable: true,
        configurable: true
    });
    HaSubContentBiblio.prototype.insert = function () {
        _super.prototype.insert.call(this, null, 'biblio', {
            cql: this._cql
        });
    };
    HaSubContentBiblio.prototype.update = function (property) {
        switch (property) {
            case 'cql':
                Services.update('biblio', { id: this._id, cql: this._cql }, function (result) { });
                break;
        }
    };
    HaSubContentBiblio.prototype.delete = function () {
        _super.prototype.delete.call(this, 'biblio');
    };
    return HaSubContentBiblio;
}(HaSubContent));
