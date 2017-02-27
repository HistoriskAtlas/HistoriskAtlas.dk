var HaLicens = (function () {
    function HaLicens(tagID, text, url) {
        this._tagID = tagID;
        this._text = text;
        this._url = url;
    }
    Object.defineProperty(HaLicens.prototype, "tagID", {
        get: function () {
            return this._tagID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "isCopyright", {
        get: function () {
            return this._tagID == 80;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "isCC", {
        get: function () {
            return this._tagID != 80;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "isBY", {
        get: function () {
            return this.isCC && this.tagID != 79;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "isNC", {
        get: function () {
            return this.tagID == 269 || this.tagID == 270 || this.tagID == 271;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "isND", {
        get: function () {
            return this.tagID == 268 || this.tagID == 271;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "isSA", {
        get: function () {
            return this.tagID == 267 || this.tagID == 270;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaLicens.prototype, "isPD", {
        get: function () {
            return this.tagID == 79;
        },
        enumerable: true,
        configurable: true
    });
    return HaLicens;
}());
//# sourceMappingURL=halicens.js.map