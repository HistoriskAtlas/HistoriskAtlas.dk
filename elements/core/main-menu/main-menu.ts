@component("main-menu")
class MainMenu extends polymer.Base implements polymer.Element {

    public panelMap: PanelMap;
    //public panelSubject: PanelTag;
    //public panelPeriod: PanelTag;
    public panelTag: PanelTag;
    public panelRoute: PanelRoute;
    public panelDigdag: PanelDigDag;
    //public panelTheme: PanelTheme;
    private menuItems: Array<MainMenuItem>;
    //private dialogTour: DialogTour;

    @property({ type: Boolean, notify: true })
    public drawerOpen: boolean;

    @property({ type: Array })
    public maps: Array<HaMap>;

    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Array, notify: true })
    public tagTops: Array<HaTag>;

    @property({ type: Array })
    public digdags: Array<HaDigDag>;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    @property({ type: Array, notify: true })
    public collectionTopLevels: Array<ICollectionTopLevel>;

    @property({ type: Number, notify: true })
    public regionType: number;

    @property({ type: Boolean })
    public touchDevice: boolean;

    @property({ type: Object, notify: true })
    public mainMap: HaMap;

    @property({ type: Number, notify: true })
    public year: number;

    @property({ type: Boolean, value: true, notify: true })
    public showMainMenu: boolean;

    //@property({ type: Boolean, value: false, notify: true })
    //public showMenuThemes: boolean;

    @property({ type: Boolean, value: false })
    public showMenuDigDag: boolean;

    @property({ type: Boolean, value: false })
    public showMenuTags: boolean;

    @property({ type: Boolean, value: false })
    public showMenuRoutes: boolean;

    @property({ type: Boolean, value: false })
    public showMenuMaps: boolean;

    //@property({ type: Boolean, notify: true })
    //public timeLineActive: boolean;

    @property({ type: Object })
    public user: HAUser;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    @property({ type: Array, notify: true })
    public themes: Array<ITheme>;

    @property({ type: Boolean })
    public isDevOrBeta: boolean;

    @property({ type: Boolean, notify: true })
    public userCreators: boolean;

    @property({ type: Boolean, notify: true })
    public profCreators: boolean;

    ready() {
        this.isDevOrBeta = Common.isDevOrBeta;
        this.panelMap = this.$.panelMap;
        //this.panelSubject = this.$.panelSubject;
        //this.panelPeriod = this.$.panelPeriod;
        this.panelTag = this.$.panelTag;
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
        //this.timeLineActive = this.showMenuDigDag && this.drawerOpen;
        document.documentElement.classList.toggle('menu-digdag-shown', this.showMenuDigDag)
    }
    @observe('showMenuTags')
    showMenuTagsChanged() {
        document.documentElement.classList.toggle('menu-tags-shown', this.showMenuTags)
    }
    @observe('showMenuRoutes')
    showMenuRoutesChanged() {
        document.documentElement.classList.toggle('menu-routes-shown', this.showMenuRoutes)
    }
    @observe('showMenuMaps')
    showMenuMapsChanged() {
        document.documentElement.classList.toggle('menu-maps-shown', this.showMenuMaps)
    }
    @observe('drawerOpen')
    drawerOpenChanged() {
        document.documentElement.classList.toggle('drawer-open', this.drawerOpen)

        //this.timeLineActive = this.showMenuDigDag && this.drawerOpen;

        if (this.drawerOpen && !this.$$('mainMenudialogTour') && !LocalStorage.get('firstMenuOpenTourDone')) {
            var dialogTour = <DialogTour>DialogTour.create('Kulturinstitutionslaget og borgerlaget', 'Her kan du vælge, hvad der vises på kortet. Vil du kun se professionelt indhold fra arkiver, biblioteker og museer, så aktiver kun kulturinstitutionslaget. Vil du også se borgerskabte fortællinger og ruter, så aktiver borgerlaget.', -40, null, null, null, 5, null, -15, null, true, 'firstMenuOpenTourDone');
            dialogTour.id = 'mainMenudialogTour';
            $(this).before(dialogTour);
            dialogTour.setCSS('position', 'fixed');
            dialogTour.setCSS('top', 'initial');
            $(dialogTour).css('margin-top', '-10px');
            $(dialogTour).css('z-index', 1000);
            //dialogTour.width = 366;

            LocalStorage.set('firstMenuOpenTourDone', 'true');
        }
    }

    menuItemShown(e: any) {
        for (var menuItem of this.menuItems)
            if (e.currentTarget != menuItem)
                menuItem.show = false;
    }

    //showHOD2017(isDevOrBeta: boolean, user: HAUser): boolean {
    //    if (isDevOrBeta)
    //        return true;
    //    return user.canAccessHoD2017;
    //}

    //tap1001() {
    //    this.set('showMenuThemes', true);
    //    this.set('theme', (<PanelTheme>this.$.panelTheme).getThemeByName('1001 fortællinger om Danmark'));
    //}
    //tapHOD2017() {
    //    this.set('showMenuThemes', true);
    //    this.set('theme', (<PanelTheme>this.$.panelTheme).getThemeByName('Historier om Danmark'));
    //}
    //tapModstandskamp() {
    //    this.set('showMenuThemes', true);
    //    //this.set('theme', (<PanelTheme>this.$.panelTheme).getThemeByName('Modstandskamp'));
    //    App.haThemes.selectTheme((<PanelTheme>this.$.panelTheme).getThemeByName('Modstandskamp'));
    //}
    tapDigterruter() {
        //this.set('showMenuThemes', true);
        //App.haThemes.selectTheme((<PanelTheme>this.$.panelTheme).getThemeByName('Danske Digterruter'));
        App.haThemes.selectTheme(App.haThemes.getThemeByName('Danske Digterruter'));
    }

    //aboutTap() {
    //    Common.dom.append(WindowAbout.create());
    //}
    theAssociationTap() {
        //Common.dom.append(WindowTheAssociation.create());
        window.open('http://blog.historiskatlas.dk/?page_id=55', '_blank')
    }
    //committeeTap() {
    //    Common.dom.append(WindowCommittee.create());
    //}
    becomeAMemberTap() {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSccVmHV4lPkaO8f2qsphqAA66zLNEW55WB77n__eXHHmIVmSw/viewform?usp=sf_link', '_blank')
        //Common.dom.append(WindowBecomeAMember.create());
    }
    guidelinesTap() {
        window.open('../../../pdf/Retningslinjer for formidling på borgerlaget på HistoriskAtlas.dk.pdf', '_blank')
    }
    monetarySupportTap() {
        //Common.dom.append(WindowMonetarySupport.create());
        window.open('http://blog.historiskatlas.dk/?page_id=220', '_blank')
    }
    privacyTap() {
        Common.dom.append(WindowPrivacy.create());
    }
    termsOfUseTap() {
        Common.dom.append(WindowTermsOfUse.create());
    }
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
        window.open('../../../pdf/Vejledning til skribenter på HistoriskAtlas.dk' + (App.haUsers.user.isPro ? 's kulturinstitutionslag april 2019' : '') + '.pdf', '_blank')
    }

    profGuidelinesTap() {
        window.open('../../../pdf/Retningslinjer for formidling på kulturinstitutionslaget på HistoriskAtlas.dk.pdf', '_blank')
    }


    isDefaultTheme(theme: ITheme): boolean {
        return theme.linkname == 'default';
    }

    newHaContent(content: IContent): HaContent {
        if (!content)
            return null;
        return new HaContent(content);
    }

}

MainMenu.register();