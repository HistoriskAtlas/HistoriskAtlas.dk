var HAPdf = (function () {
    function HAPdf(data) {
        this.id = data.id;
        this.title = data.title;
        this.filename = data.filename;
        this.src = data.src;
        this.deleted = data.deleted;
    }
    Object.defineProperty(HAPdf.prototype, "_id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "_title", {
        get: function () {
            return this.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "_filename", {
        get: function () {
            return this.filename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "_src", {
        get: function () {
            return this.src;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "_deleted", {
        get: function () {
            return this.deleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "setTitle", {
        set: function (newTitle) {
            this.title = newTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "setFilename", {
        set: function (newFilename) {
            this.filename = newFilename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "setSrc", {
        set: function (newSrc) {
            this.src = newSrc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAPdf.prototype, "setDeleted", {
        set: function (newDeleted) {
            this.deleted = newDeleted;
        },
        enumerable: true,
        configurable: true
    });
    return HAPdf;
}());
//# sourceMappingURL=hapdf.js.map