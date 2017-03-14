var HaSubContent = (function () {
    //private _ordering: number; Future upgrade?
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
        //set id(newValue: number) {
        //    this._id = newValue;
        //}
        get: function () {
            return this._created;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaSubContent.prototype, "user", {
        //set created(newValue: Date) {
        //    this._created = newValue;
        //}
        //get createdDate(): string {
        //    return Common.shortDate(this._created);
        //}
        //get createdTime(): string {
        //    return Common.shortTime(this._created);
        //}
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
//# sourceMappingURL=hasubcontent.js.map