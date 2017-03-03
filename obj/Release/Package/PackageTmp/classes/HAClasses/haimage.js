var HAImage = (function () {
    //"yearisapprox": false,
    //"created": "2009-02-13 01:11:47.533",
    //"deleted": "",
    //"userid": 5
    function HAImage(data) {
        this._id = data.imageid;
        this._year = data.year;
        this._text = data.text == null ? '' : data.text;
        this._photographer = data.photographer == null ? '' : data.photographer;
        this._licensee = data.licensee == null ? '' : data.licensee;
        this.tags = [];
        if (data.tag_images)
            for (var _i = 0, _a = data.tag_images; _i < _a.length; _i++) {
                var tag_image = _a[_i];
                if (typeof tag_image === 'object')
                    this.tags.push(new HaTag(tag_image.tag));
                else
                    this.tags.push(App.haTags.byId[tag_image]);
            }
    }
    Object.defineProperty(HAImage.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAImage.prototype, "year", {
        get: function () {
            return this._year == null ? '' : this._year.toString();
        },
        set: function (newVal) {
            this._year = newVal == '' ? null : parseInt(newVal);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAImage.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (newVal) {
            this._text = newVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAImage.prototype, "photographer", {
        get: function () {
            return this._photographer;
        },
        set: function (newVal) {
            this._photographer = newVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAImage.prototype, "licensee", {
        get: function () {
            return this._licensee;
        },
        set: function (newVal) {
            this._licensee = newVal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAImage.prototype, "url", {
        get: function () {
            return Common.api + 'image/' + this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAImage.prototype, "urlLowRes", {
        get: function () {
            return Common.api + 'image/' + this._id + '?action=scale&size={640:10000}&scalemode=inner';
        },
        enumerable: true,
        configurable: true
    });
    return HAImage;
}());
//# sourceMappingURL=haimage.js.map