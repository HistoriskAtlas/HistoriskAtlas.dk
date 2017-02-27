var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PanelUserEditorial = (function (_super) {
    __extends(PanelUserEditorial, _super);
    function PanelUserEditorial() {
        _super.apply(this, arguments);
    }
    PanelUserEditorial.prototype.selectedChanged = function () {
        if (this.selected && !this.users) {
            this.users = [];
            this.sortOnName();
            this.fetchUsers();
        }
    };
    PanelUserEditorial.prototype.filterCheckForEnter = function (e) {
        if (e.keyCode === 13)
            this.fetchUsers();
    };
    PanelUserEditorial.prototype.fetchUsers = function () {
        var _this = this;
        Services.get('user', {
            'schema': JSON.stringify({
                user: {
                    fields: [
                        'login',
                        'firstname',
                        'lastname',
                        {
                            user_institutions: [
                                {
                                    institution: [
                                        {
                                            tag: ['plurname']
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    filters: HaUsers.getApiFilter(this.filter)
                }
            }),
            'userhierarkis1': JSON.stringify({
                parentid: App.haUsers.user.id
            }),
            'count': 'all'
        }, function (result) {
            _this.updateUsers(result.data);
        });
    };
    PanelUserEditorial.prototype.updateUsers = function (newList) {
        if (newList === void 0) { newList = null; }
        //this.set('users', (newList ? newList : this.users).sort(this.compare));
        this.$.selector.sort(null, newList);
    };
    //itemTap(e: any) {
    //    Common.geoClick(e.model.item.id);
    //}
    PanelUserEditorial.prototype.institutions = function (institutions) {
        var result = [];
        for (var _i = 0, institutions_1 = institutions; _i < institutions_1.length; _i++) {
            var data = institutions_1[_i];
            result.push(data.institution.tag.plurname);
        }
        return result.join(', ');
    };
    PanelUserEditorial.prototype.sortOnLogin = function () {
        this.$.selector.sort(this.compareLogin);
    };
    PanelUserEditorial.prototype.compareLogin = function (a, b) {
        return a.login.localeCompare(b.login);
    };
    PanelUserEditorial.prototype.sortOnName = function () {
        this.$.selector.sort(this.compareName);
    };
    PanelUserEditorial.prototype.compareName = function (a, b) {
        return (a.firstname + a.lastname).localeCompare(b.firstname + b.lastname);
    };
    PanelUserEditorial.prototype.sortOnInstitution = function () {
        this.$.selector.sort(this.compareInstitution);
    };
    PanelUserEditorial.prototype.compareInstitution = function (a, b) {
        if (a.user_institutions.length == 0)
            return b.user_institutions.length == 0 ? 0 : 1;
        if (b.user_institutions.length == 0)
            return a.user_institutions.length == 0 ? 0 : -1;
        return a.user_institutions[0].institution.tag.plurname.localeCompare(b.user_institutions[0].institution.tag.plurname);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], PanelUserEditorial.prototype, "users", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], PanelUserEditorial.prototype, "filter", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PanelUserEditorial.prototype, "selected", void 0);
    __decorate([
        observe('selected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PanelUserEditorial.prototype, "selectedChanged", null);
    PanelUserEditorial = __decorate([
        component("panel-user-editorial"), 
        __metadata('design:paramtypes', [])
    ], PanelUserEditorial);
    return PanelUserEditorial;
}(polymer.Base));
PanelUserEditorial.register();
//# sourceMappingURL=panel-user-editorial.js.map