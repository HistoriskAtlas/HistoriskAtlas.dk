var HAUser = (function () {
    //private _deleted: boolean;
    //private institutionid: number;
    //private licensename: string;
    //private geoid: number;
    //private rolelevel: string;
    //private passwordvalidto: string;
    //private updatepassrequired: boolean;
    //private location: string;
    //private profiletext: string;
    function HAUser(data) {
        this._institutions = [];
        this._id = data.id;
        this._login = data.login;
        this._firstname = data.firstname;
        this._lastname = data.lastname;
        this._email = data.email;
        this._isActive = data.isactive;
        this._role = data.role;
        this._created = data.created;
        this._favourites = new HaCollection(data.favourites);
        this._isDefault = !this._id; //TODO: not always so...
        if (data.user_institutions)
            for (var _i = 0, _a = data.user_institutions; _i < _a.length; _i++) {
                var user_institution = _a[_i];
                this._institutions.push(new HAInstitution(user_institution.institution));
            }
        //this._deleted = data.deleted;
        //this.institutionid = data.institutionid;
        //this.licensename = data.licensename;
        //this.geoid = data.geoid;
        //this.rolelevel = data.rolelevel;
        //this.passwordvalidto = data.passwordvalidto;
        //this.updatepassrequired = data.updatepassrequired;
        //this.isactive = data.isactive;
        ////added
        //this.location = data.location;
        //this.profiletext = data.profiletext;
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
        //get password(): string { return this._password; }
        //set password(newVal: string) { this._password = newVal; }
        get: function () { return this._isActive; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HAUser.prototype, "firstname", {
        //get role(): number { return this._role; }
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
        //for (var institution of this._institutions)
        //    if (geo.institutionTags.indexOf(institution.tag) > -1)
        //        return true;
        //if (!this.geos)
        //    return false;
        //return this.geos.indexOf(geo) > -1;
    };
    HAUser.prototype.canEditCollection = function (collection) {
        if (!collection)
            return false;
        return collection.user.id == this._id; //TODO: should check for "userLayer" as above.....
    };
    return HAUser;
}());
//# sourceMappingURL=hauser.js.map