var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HaSubContentExternal = (function (_super) {
    __extends(HaSubContentExternal, _super);
    function HaSubContentExternal(data, content) {
        _super.call(this, data, content);
        this._text = data.text;
        this._link = data.link;
    }
    Object.defineProperty(HaSubContentExternal.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaSubContentExternal.prototype, "link", {
        get: function () {
            return this._link;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaSubContentExternal.prototype, "thumbnailUrl", {
        get: function () {
            return 'http://img.youtube.com/vi/' + this._link + '/0.jpg';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaSubContentExternal.prototype, "embedUrl", {
        get: function () {
            return 'https://www.youtube.com/embed/' + this._link + '?autoplay=1&rel=0';
        },
        enumerable: true,
        configurable: true
    });
    HaSubContentExternal.prototype.insert = function () {
    };
    HaSubContentExternal.prototype.delete = function () {
    };
    return HaSubContentExternal;
}(HaSubContent));
