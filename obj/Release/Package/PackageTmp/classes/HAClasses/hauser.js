var HAUser = (function () {
    function HAUser(data) {
        this._institutions = [];
        this._id = data.id;
        this._login = data.login;
        this._firstname = data.firstname;
        this._lastname = data.lastname;
        this._email = data.email;
        this._isActive = data.isactive;
        this._role = data.role;
        this._about = data.about;
        this._created = data.created;
        this._favourites = new HaCollection(data.favourites);
        this._isDefault = !this._id;
        if (data.user_institutions)
            for (var _i = 0, _a = data.user_institutions; _i < _a.length; _i++) {
                var user_institution = _a[_i];
                this._institutions.push(new HAInstitution(user_institution.institution));
            }
    }
    Object.defineProperty(HAUser, "default", {
        get: function () {
            return new HAUser({ isactive: true, firstname: '' });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "id", {
        get: function () { return this._id; },
        set: function (newVal) { this._id = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "login", {
        get: function () { return this._login; },
        set: function (newVal) { this._login = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "isActive", {
        get: function () { return this._isActive; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "firstname", {
        get: function () { return this._firstname; },
        set: function (newVal) { this._firstname = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "lastname", {
        get: function () { return this._lastname; },
        set: function (newVal) { this._lastname = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "email", {
        get: function () { return this._email; },
        set: function (newVal) { this._email = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "institutions", {
        get: function () { return this._institutions; },
        set: function (newVal) { this._institutions = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "currentInstitution", {
        get: function () {
            return this._institutions.length == 0 ? null : this._institutions[0];
        },
        enumerable: true,
        configurable: true
    });
    HAUser.prototype.isMemberOf = function (institutionTagID) {
        for (var _i = 0, _a = this._institutions; _i < _a.length; _i++) {
            var institution = _a[_i];
            if (institution.tagid == institutionTagID)
                return true;
        }
        return false;
    };
    Object.defineProperty(HAUser.prototype, "created", {
        get: function () { return this._created; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "favourites", {
        get: function () { return this._favourites; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "isDefault", {
        get: function () { return this._isDefault; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "isPro", {
        get: function () { return this.institutions.length > 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "fullname", {
        get: function () { return this._firstname + ' ' + this._lastname; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "fullnameAndAbout", {
        get: function () { return this.fullname + (this._about ? ', ' + this._about : ''); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "isWriter", {
        get: function () { return this._role >= 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "isEditor", {
        get: function () { return this._role >= 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "isAdmin", {
        get: function () { return this._role >= 4; },
        enumerable: true,
        configurable: true
    });
    HAUser.prototype.canEdit = function (geo) {
        return geo.userLayer;
    };
    HAUser.prototype.canEditCollection = function (collection) {
        if (!collection)
            return false;
        return collection.user.id == this._id;
    };
    return HAUser;
}());
