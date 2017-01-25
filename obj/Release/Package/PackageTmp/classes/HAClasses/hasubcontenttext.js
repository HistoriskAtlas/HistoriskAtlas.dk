var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HaSubContentText = (function (_super) {
    __extends(HaSubContentText, _super);
    function HaSubContentText(data, content) {
        _super.call(this, data, content);
        this._text = Common.rich2html(data.text1);
        this._headline = Common.rich2html(data.headline);
    }
    Object.defineProperty(HaSubContentText.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaSubContentText.prototype, "headline", {
        get: function () {
            return this._headline;
        },
        set: function (value) {
            this._headline = value;
        },
        enumerable: true,
        configurable: true
    });
    HaSubContentText.prototype.insert = function (callback) {
        _super.prototype.insert.call(this, callback, 'text', {
            headline: this._headline,
            text1: Common.html2rich(this._text)
        });
    };
    HaSubContentText.prototype.update = function (property) {
        switch (property) {
            case 'headline':
                Services.update('text', { id: this._id, headline: this._headline }, function (result) { });
                break;
            case 'text':
                Services.update('text', { id: this._id, text1: Common.html2rich(this._text) }, function (result) { });
                break;
        }
    };
    HaSubContentText.prototype.delete = function () {
        _super.prototype.delete.call(this, 'text');
    };
    return HaSubContentText;
}(HaSubContent));
