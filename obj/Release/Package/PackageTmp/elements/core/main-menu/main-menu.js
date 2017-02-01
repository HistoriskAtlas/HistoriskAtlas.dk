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
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        _super.apply(this, arguments);
    }
    MainMenu.prototype.ready = function () {
        this.isDevOrBeta = Common.isDevOrBeta;
        this.panelMap = this.$.panelMap;
        this.panelSubject = this.$.panelSubject;
        this.panelPeriod = this.$.panelPeriod;
        this.panelRoute = this.$.panelRoute;
        this.panelDigdag = this.$.panelDigdag;
        //this.panelTheme = this.$$('#panelTheme');
        this.menuItems = [];
        var elems = this.querySelectorAll('main-menu-item');
        for (var i = 0; i < elems.length; i++)
            this.menuItems.push(elems.item(i));
        for (var _i = 0, _a = this.menuItems; _i < _a.length; _i++) {
            var menuItem = _a[_i];
            this.listen(menuItem, 'shown', 'menuItemShown');
        }
    };
    MainMenu.prototype.showMenuDigDagChanged = function () {
        this.timeLineActive = this.showMenuDigDag && this.drawerOpen;
    };
    MainMenu.prototype.drawerOpenChanged = function () {
        this.timeLineActive = this.showMenuDigDag && this.drawerOpen;
    };
    MainMenu.prototype.menuItemShown = function (e) {
        for (var _i = 0, _a = this.menuItems; _i < _a.length; _i++) {
            var menuItem = _a[_i];
            if (e.currentTarget != menuItem)
                menuItem.show = false;
        }
    };
    MainMenu.prototype.tap1001 = function () {
        Common.dom.append(WindowInstitution.create(App.haTags.byId[731]));
    };
    MainMenu.prototype.tapHOD2017 = function () {
        this.set('showMenuThemes', true);
        this.set('theme', this.$$('#panelTheme').getThemeByName('Historier om Danmark 2017'));
    };
    MainMenu.prototype.aboutTap = function () {
        Common.dom.append(WindowAbout.create());
    };
    MainMenu.prototype.theAssociationTap = function () {
        Common.dom.append(WindowTheAssociation.create());
    };
    MainMenu.prototype.committeeTap = function () {
        Common.dom.append(WindowCommittee.create());
    };
    MainMenu.prototype.becomeAMemberTap = function () {
        Common.dom.append(WindowBecomeAMember.create());
    };
    MainMenu.prototype.guidelinesTap = function () {
        window.open('../../../pdf/Retningslinjer for formidling på borgerlaget på HistoriskAtlas.dk.pdf', '_blank');
    };
    MainMenu.prototype.monetarySupportTap = function () {
        Common.dom.append(WindowMonetarySupport.create());
    };
    MainMenu.prototype.privacyTap = function () {
        Common.dom.append(WindowPrivacy.create());
    };
    MainMenu.prototype.termsOfUseTap = function () {
        Common.dom.append(WindowTermsOfUse.create());
    };
    MainMenu.prototype.blogTap = function () {
        window.open('http://blog.historiskatlas.dk/', '_blank');
    };
    MainMenu.prototype.facebookTap = function () {
        window.open('http://www.facebook.com/historiskatlas', '_blank');
    };
    MainMenu.prototype.feedbackTap = function () {
        Common.dom.append(WindowFeedback.create());
    };
    MainMenu.prototype.contactTap = function () {
        Common.dom.append(WindowContact.create());
    };
    MainMenu.prototype.guidedTourTap = function () {
        this.drawerOpen = false;
        Common.dom.append(DialogTourIntro.create(false));
    };
    MainMenu.prototype.introVideoTap = function () {
        Common.dom.append(DialogVideoIntro.create());
    };
    MainMenu.prototype.profGuidelinesTap = function () {
        window.open('../../../pdf/Retningslinjer for formidling på kulturinstitutionslaget på HistoriskAtlas.dk.pdf', '_blank');
    };
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "drawerOpen", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], MainMenu.prototype, "maps", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], MainMenu.prototype, "tags", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], MainMenu.prototype, "digdags", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], MainMenu.prototype, "collections", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], MainMenu.prototype, "regionTypeID", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "touchDevice", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaMap)
    ], MainMenu.prototype, "mainMap", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], MainMenu.prototype, "year", void 0);
    __decorate([
        property({ type: Boolean, value: true, notify: true }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "showMainMenu", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "showMenuThemes", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "showMenuDigDag", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "showMenuSubjects", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "showMenuRoutes", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "showMenuMaps", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "timeLineActive", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HAUser)
    ], MainMenu.prototype, "user", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], MainMenu.prototype, "theme", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], MainMenu.prototype, "isDevOrBeta", void 0);
    __decorate([
        observe('showMenuDigDag'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MainMenu.prototype, "showMenuDigDagChanged", null);
    __decorate([
        observe('drawerOpen'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MainMenu.prototype, "drawerOpenChanged", null);
    MainMenu = __decorate([
        component("main-menu"), 
        __metadata('design:paramtypes', [])
    ], MainMenu);
    return MainMenu;
}(polymer.Base));
MainMenu.register();
//# sourceMappingURL=main-menu.js.map