var HaSubContent = (function () {
    function HaSubContent(data, content) {
        this._id = data.id;
        this._created = data.created ? new Date(data.created) : null;
        this._user = data.user;
        this._content = content;
    }
    Object.defineProperty(HaSubContent.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaSubContent.prototype, "created", {
        get: function () {
            return this._created;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaSubContent.prototype, "user", {
        get: function () {
            return this._user;
        },
        enumerable: true,
        configurable: true
    });
    HaSubContent.prototype.insert = function (callback, table, data) {
        var _this = this;
        data.contentid = this._content.id,
            Services.insert(table, data, function (result) {
                _this._id = result.data[0].id;
                _this._created = new Date(result.data[0].created);
                _this._user = { firstname: App.haUsers.user.firstname, lastname: App.haUsers.user.lastname };
                if (callback)
                    callback(['id', 'created', 'user']);
            });
    };
    HaSubContent.prototype.delete = function (table) {
        Services.delete(table, { id: this._id, deletemode: 'permanent' }, function (result) { });
    };
    return HaSubContent;
}());
