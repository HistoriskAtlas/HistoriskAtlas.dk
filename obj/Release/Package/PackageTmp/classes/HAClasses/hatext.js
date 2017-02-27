var HaText = (function () {
    function HaText(data) {
        this.id = data.id;
        this.text = data.text;
        this.headline = data.headline;
    }
    Object.defineProperty(HaText.prototype, "setText", {
        set: function (newText) {
            this.text = newText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaText.prototype, "setHeadline", {
        set: function (newHeadline) {
            this.headline = newHeadline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaText.prototype, "_id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaText.prototype, "_text", {
        get: function () {
            return this.text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaText.prototype, "_headline", {
        get: function () {
            return this.headline;
        },
        enumerable: true,
        configurable: true
    });
    return HaText;
}());
//# sourceMappingURL=hatext.js.map