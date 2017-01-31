var HAInstitution = (function () {
    function HAInstitution(data) {
        this._id = data.id;
        this._url = data.url;
        this._email = data.email;
        this._type = data.type;
        this._tagid = data.tagid;
        if (data.content)
            this._content = new HaContent(data.content);
    }
    Object.defineProperty(HAInstitution.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (newUrl) {
            this._url = newUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAInstitution.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function (newEmail) {
            this._email = newEmail;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAInstitution.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (newType) {
            this._type = newType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAInstitution.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAInstitution.prototype, "tagid", {
        get: function () {
            return this._tagid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAInstitution.prototype, "name", {
        get: function () {
            return this.tag.plurName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAInstitution.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAInstitution.prototype, "tag", {
        get: function () {
            return App.haTags.byId[this._tagid];
        },
        enumerable: true,
        configurable: true
    });
    HAInstitution.types = [, 'Arkiv', 'Bibliotek', 'Museum'];
    return HAInstitution;
}());
//# sourceMappingURL=hainstitution.js.map