@component("main-menu")
class MainMenu extends polymer.Base implements polymer.Element {

    public panelMap: PanelMap;
    public panelSubject: PanelTag;
    public panelPeriod: PanelTag;
    public panelRoute: PanelRoute;
    public panelDigdag: PanelDigDag;
    //public panelTheme: PanelTheme;
    private menuItems: Array<MainMenuItem>;

    @property({ type: Boolean, notify: true })
    public drawerOpen: boolean;

    @property({ type: Array })
    public maps: Array<HaMap>;

    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Array, notify: true})
    public tagTops: Array<HaTag>;

    @property({ type: Array })
    public digdags: Array<HaDigDag>;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    @property({ type: Number, notify: true })
    public regionTypeID: number;

    @property({ type: Boolean })
    public touchDevice: boolean;

    @property({ type: Object, notify: true })
    public mainMap: HaMap;

    @property({ type: Number, notify: true })
    public year: number;

    @property({ type: Boolean, value: true, notify: true })
    public showMainMenu: boolean;

    @property({ type: Boolean, value: false, notify: true })
    public showMenuThemes: boolean;

    @property({ type: Boolean, value: false })
    public showMenuDigDag: boolean;

    @property({ type: Boolean, value: false })
    public showMenuSubjects: boolean;

    @property({ type: Boolean, value: false })
    public showMenuRoutes: boolean;

    @property({ type: Boolean, value: false })
    public showMenuMaps: boolean;

    @property({ type: Boolean, notify: true })
    public timeLineActive: boolean;

    @property({ type: Object })
    public user: HAUser;

    @property({ type: Object, notify: true })
    public theme: ITheme; 

    @property({ type: Boolean })
    public isDevOrBeta: boolean;

    @property({ type: Boolean, notify: true })
    public userCreators: boolean;

    @property({ type: Boolean, notify: true })
    public profCreators: boolean;

    ready() {
        this.isDevOrBeta = Common.isDevOrBeta;
        this.panelMap = this.$.panelMap;
        this.panelSubject = this.$.panelSubject;
        this.panelPeriod = this.$.panelPeriod;
        this.panelRoute = this.$.panelRoute;
        this.panelDigdag = this.$.panelDigdag;
        //this.panelTheme = this.$$('#panelTheme');

        this.menuItems = [];
        var elems = this.querySelectorAll('main-menu > main-menu-item');
        for (var i = 0; i < elems.length; i++)
            this.menuItems.push(<MainMenuItem>elems.item(i));
        for (var menuItem of this.menuItems)
            this.listen(menuItem, 'shown', 'menuItemShown');
    }

    @observe('showMenuDigDag')
    showMenuDigDagChanged() {
        this.timeLineActive = this.showMenuDigDag && this.drawerOpen;
    }
    @observe('drawerOpen')
    drawerOpenChanged() {
        this.timeLineActive = this.showMenuDigDag && this.drawerOpen;
    }

    menuItemShown(e: any) {
        for (var menuItem of this.menuItems)
            if (e.currentTarget != menuItem)
                menuItem.show = false;
    }

    showHOD2017(isDevOrBeta: boolean, user: HAUser): boolean {
        if (isDevOrBeta)
            return true;
        return user.canAccessHoD2017;
    }

    tap1001() {
        this.set('showMenuThemes', true);
        this.set('theme', (<PanelTheme>this.$.panelTheme).getThemeByName('1001 fortællinger om Danmark'));
        //Common.dom.append(WindowInstitution.create(App.haTags.byId[731]));
    }
    tapHOD2017() {
        this.set('showMenuThemes', true);
        this.set('theme', (<PanelTheme>this.$.panelTheme).getThemeByName('Historier om Danmark'));
    }

    aboutTap() {
        Common.dom.append(WindowAbout.create());
    }
    theAssociationTap() {
        Common.dom.append(WindowTheAssociation.create());
    }
    committeeTap() {
        Common.dom.append(WindowCommittee.create());
    }
    becomeAMemberTap() {
        Common.dom.append(WindowBecomeAMember.create());
    }
    guidelinesTap() {
        window.open('../../../pdf/Retningslinjer for formidling på borgerlaget på HistoriskAtlas.dk.pdf', '_blank')
    }
    monetarySupportTap() {
        Common.dom.append(WindowMonetarySupport.create());
    }
    privacyTap() {
        Common.dom.append(WindowPrivacy.create());
    }
    termsOfUseTap() {
        Common.dom.append(WindowTermsOfUse.create());
    }

    //blogTap() {
    //    window.open('http://blog.historiskatlas.dk/', '_blank')
    //}
    facebookTap() {
        window.open('http://www.facebook.com/historiskatlas', '_blank')
    }
    feedbackTap() {
        Common.dom.append(WindowFeedback.create());
    }
    contactTap() {
        Common.dom.append(WindowContact.create());
    }
    guidedTourTap() {
        this.drawerOpen = false;
        Common.dom.append(DialogTourIntro.create(false));
    }
    introVideoTap() {
        Common.dom.append(DialogVideoIntro.create());
    }
    writerGuideTap() {
        window.open('../../../pdf/Vejledning til skribenter på HistoriskAtlas.pdf', '_blank')
    }

    profGuidelinesTap() {
        window.open('../../../pdf/Retningslinjer for formidling på kulturinstitutionslaget på HistoriskAtlas.dk.pdf', '_blank')
    }
}

MainMenu.register();