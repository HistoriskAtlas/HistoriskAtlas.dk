@component("window-geo")
class WindowGeo extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public geo: HaGeo & Object;

    @property({ type: Array })
    public contents: Array<HaContent>;

    @property({ type: Object })
    public editorialContent: HaContent;

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    //@property({ type: Number, value: 0 })
    //public selectedPanel: number;

    //@property({ type: Boolean })
    //public windowImageShown: boolean;

    @property({ type: Boolean, value: false })
    public windowEditorialShown: boolean;

    @property({ type: Boolean })
    public standalone: boolean;

    @property({ type: Boolean })
    public dev: boolean;

    @property({ type: Boolean })
    public devOrBeta: boolean;

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Boolean, value: false })
    public uploading: boolean

    @property({ type: Boolean })
    public touchDevice: boolean;

    @property({ type: Object })
    public curContent: HaContent;

    private fileUpload: FileUpload;
    //private contentToDelete: HaContent;

    //@observe("geo.*")
    //geoChanged(changeRecord: any) {
    //    //alert('changed: ' + changeRecord.value);
    //    if (changeRecord.path.indexOf('.') !== -1)
    //        this.set('geo', this.geo);
    //        //this.set(changeRecord.path, changeRecord.value);
    //}

    //@listen("add.paper-dropdown-open")
    //addPaperDropdownOpen() {
    //    this.$.addMenu.selected = null;
    //}
    //@listen("addToFavourites.tap")

    tabTap(e: Event) {
        var repeater = this.$$('#templateContentTabs');
        this.curContent = <HaContent>repeater.modelForElement(e.target).content;
    }
    //@observe('curContent')
    //curContentChanged() {
    //    setTimeout(() => { this.$$('#tabMenu').notifyResize(); }, 0);
    //}

    togglePublishText(online: boolean): string {
        return (online ? 'Afp' : 'P') + 'ublicér fortælling';
    }
    togglePublishedTap() {
        if (this.geo.online) {
            $(this).append(DialogRichText.create('Du er ved at afpublicere fortællingen.', 'Skriv evt. en kommentar her...', (message) => {
                this.set('geo.online', false);
                this.insertEditorialText('<b>Afpubliceret</b><br>' + message);
            }));
            return;
        }

        if (App.haUsers.user.isEditor) {
            this.set('geo.online', true);
            this.insertEditorialText('<b>Publiceret</b>');
            (<HaGeoService>this.$.haGeoService).removeTagById(730);
            return;
        }

        $(this).append(DialogRichText.create('Du er ved at sende fortællingen til redaktionel gennemgang og publicering.', 'Skriv en kommentar til redaktøren her...', (message) => {
            (<HaGeoService>this.$.haGeoService).addTagById(730, true, true);
            this.insertEditorialText('<b>Sendt til publicering</b><br>' + message);
            Services.proxy('sendgeotopublish', {
                geoid: this.geo.id,
                remark: Common.html2rich(message)
            })
        }));
    }
    private insertEditorialText(text: string) {
        if (!this.editorialContent)
            this.push('contents', new HaContent({ geoid: this.geo.id, ordering: 0, contenttypeid: 3 }));
        this.push('editorialContent.subContents', new HaSubContentText({ headline: '', text1: Common.html2rich(text) }, this.editorialContent));
    }

    addTextContentTap() {
        this.$$('#contentTitleDialog').open('content-title-confirmed');
    }
    @listen('content-title-confirmed')
    contentTitleConfirmed(e: any) {
        var ordering = this.contents.length == 0 ? 1 : Math.max.apply(Math, this.contents.map((o) => { return o.ordering; })) + 1;
        var content = new HaContent({ geoid: this.geo.id, headline: e.detail, ordering: ordering, contenttypeid: 0, texts: [{ text1: '', ordering: 0 }] });
        this.push('contents', content);
        this.selectedTab = ordering; //this.contents.length;
    }
    addBiblioContentTap() {
        var ordering = this.contents.length == 0 ? 1 : Math.max.apply(Math, this.contents.map((o) => { return o.ordering; })) + 1; //TODO: same as above?
        var content = new HaContent({ geoid: this.geo.id, headline: '', ordering: ordering, contenttypeid: 1, biblios: [{ cql: this.geo.title, ordering: 0 }] });
        this.push('contents', content);
        this.selectedTab = ordering; //this.contents.length;
    }

    addTextSubContentTap() {
        this.push('contents.' + this.contents.indexOf(this.curContent) + '.subContents', new HaSubContentText({ text1: '', ordering: this.curContent.subContents.length }, this.curContent));
    }
    addPDFSubContentTap() {
        this.push('contents.' + this.contents.indexOf(this.curContent) + '.subContents', new HaSubContentPDF({ title: '', filename: '', ordering: this.curContent.subContents.length }, this.curContent));
    }

    toggleAddContentSubmenu(e) {
        this.$$('#addContentDialog').open();
    }
    toggleAddSubContentSubmenu(e) {
        this.$$('#addSubContentDialog').open();
    }

    editorialTap() {
        this.windowEditorialShown = !this.windowEditorialShown;
    }
    windowEditorialClosed() {
        this.windowEditorialShown = false;
    }

    tabMenuButtonTap(e: Event) {
        var tab = $(e.currentTarget).parents('paper-tab.window-geo');
        this.$$('#tabMenu').positionTarget = tab[0];
        this.$$('#tabMenu').open();
    }

    closeTabMenu() {
        this.$$('#tabMenu').close();
    }

    deleteContent() {
        $(this).append(DialogConfirm.create('delete-content', 'Er du sikker på at du vil slette fanebladet?'));
    }
    @listen('delete-content-confirmed')
    deleteContentConfirmed(e: any) {
        this.splice('contents', this.contents.indexOf(this.curContent), 1);
        setTimeout(() => { this.selectedTab = 0; }, 100);
    }

    renameContent() {
        this.$$('#contentTitleDialog').open('rename-content-confirmed', this.curContent.headline);
    }
    @listen('rename-content-confirmed')
    renameContentConfirmed(e: any) {
        this.set('contents.' + this.contents.indexOf(this.curContent) + '.headline', e.detail);
        setTimeout(() => this.$$('#tabs').notifyResize(), 0);
    }

    moveLeftContent() { this.moveContent(-1); }
    moveRightContent() { this.moveContent(1); }
    moveContent(delta: number) {
        var curIndex = this.contents.indexOf(this.curContent);
        var otherIndex;
        for (var content of this.contents)
            if (content.ordering == this.curContent.ordering + delta) {
                otherIndex = this.contents.indexOf(content)
                break;
            }

        var temp = this.contents[otherIndex].ordering;
        this.set('contents.' + otherIndex + '.ordering', this.curContent.ordering);
        this.set('contents.' + curIndex + '.ordering', temp);
        this.notifyPath('curContent.ordering', this.curContent.ordering);
        setTimeout(() => this.selectedTab = parseInt(<any>this.selectedTab) + delta, 0);
    }

    downloadPDF() {
        //window.open(this.geo.link + '.pdf');

        Common.savePDF(this.geo.link + '.pdf', this.geo.title + " - HistoriskAtlas.dk.pdf");
    }

    shareLink() {
        this.$$('#shareLinkDialog').open();
    }
    shareFB() {
        Common.loadJS('facebook-jssdk', '//connect.facebook.com/da_DK/sdk.js', (e) => {
            FB.init({ appId: '876939902336614', xfbml: true, version: 'v2.9' });
            FB.ui({
                method: 'share',
                href: this.geo.link,
            }, (response) => {
            });
        });
    }
    shareQR() {
        window.open('https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=http://historiskatlas.dk/_(' + this.geo.id + ')', '_blank')
    }

    //addToFavouritesTap() {
    //    App.global.showFavourites();
    //    if (App.haUsers.user.favourites.geos.indexOf(this.geo) == -1)
    //        App.haUsers.push('user.favourites.geos', this.geo);
    //}

    addToRouteTap() {
        Common.dom.append(DialogRouteSelection.create('Tilføj til turforslag...', this.geo));
    }

    deleteGeo() { 
        $(this).append(DialogConfirm.create('delete-geo', 'Er du sikker på at du vil slette denne fortælling?'));
    }
    @listen('delete-geo-confirmed')
    deleteGeoConfirmed() {
        if (!this.geo.title)
            this.geo.title = ' '; //fix to make the window closeable
        this.$.windowbasic.close();
        App.haGeos.deleteGeo(this.geo);
    }

    //addTagTap() {
    //    this.addingTag = !this.addingTag;
    //    if (!this.addingTag) {
    //        App.mainMenu.panelSubject.haGeoServiceAwaitingTagSelect = null;
    //        return;
    //    }

    //    App.mainMenu.drawerOpen = true;
    //    App.mainMenu.showMenuSubjects = true;
    //    App.mainMenu.panelSubject.haGeoServiceAwaitingTagSelect = this.$.haGeoService;
    //    App.toast.show('Vælg fra listen');
    //}

    //removeTagTap(e) {
    //    //this.splice('geo.tags2', this.geo.tags2.indexOf(e.model.tag), 1);
    //    (<HaGeoService>this.$.haGeoService).removeTag(e.model.dataHost.dataHost.tag);
    //}

    reportTap(e) {
        this.$$('#reportDialog').open();
    }

    imageUrl(images: Array<HAImage>) {
        if (!images)
            return '';
        return images.length == 0 ? '' : images[0].urlLowRes;
    }

    toolbarMode(selectedTab: number) {
        return selectedTab == 0 ? 'seamed' : 'standard';
    }

    externalContent(contents: Array<HaContent>): HaContent {
        for (var content of contents)
            if (content.isExternal)
                return content;
        return null;
    }
    youTubeThumbnailUrl(contents: Array<HaContent>): string {
        var content = this.externalContent(contents)
        return content ? (<HaSubContentExternal>content.subContents[0]).thumbnailUrl : null;
    }
    
    @listen("windowbasic.closing")
    windowClosing(e: Event) {
        if (this.editing && !this.geo.title) {
            (<WindowBasic>this.$.windowbasic).cancelClose = true;
            Common.dom.append(DialogAlert.create('Giv fortællingen en titel, før du lukker den.', () => {
                (<PlainText>this.$$('#plainTextTitle')).setFocus();
            }));
        }
    }

    @listen("windowbasic.closed")
    windowClosed() {
        if (this.standalone) {
            var coord = Common.fromMapCoord(this.geo.coord);
            location.href = location.href.replace(/[^\/]*_\(([0-9]+)\)/g, '') + '@' + coord[1].toFixed(6) + ',' + coord[0].toFixed(6) + ',16z';
        }
    }

    @listen("imageContainer.tap")
    @listen("imageCount.tap")
    imageTap() {
        if (this.geo.images.length == 0) {
            if (this.editing)
                this.addImageTap();
            return;
        }
        var width: number = this.$.windowbasic.width;
        var height: number = ($('#imageContainer').offset().top + $('#imageContainer').height() / 2 - this.$.windowbasic.top) * 2;
        Common.dom.append(WindowImage.create(this, width, height, this.$.windowbasic.left, this.$.windowbasic.top));
    }
    addImageTap() {
        this.startUpload();
        this.fileUpload.uploadClick();
    }

    //licens(): HaLicens {
    //    return this.geo.licens;
    //}

    @listen('licens-changed')
    licensChanged(e: any) {
    //    var curLicens = this.geo.licens;
    //    if (curLicens) {
    //        var tag = App.haTags.byId[curLicens.tagID];
    //        this.splice('geo.tags', this.geo.tags.indexOf(tag), 1);
    //    }

    //    var tag = App.haTags.byId[e.detail.tagID];
        //    this.push('geo.tags', tag)

        (<HaGeoService>this.$.haGeoService).addTagById(e.detail.tagID, true, true);
    }

    @listen('read-more-tapped')
    readMoreTapped() {
        if (this.contents.length > 0)
            this.selectedTab = 1;
    }

    constructor(geo: HaGeo) {
        super();

        this.standalone = !geo;
        this.dev = this.standalone ? (<any>window).passed.dev : App.isDev;
        this.devOrBeta = Common.isDevOrBeta;
        this.geo = this.standalone ? new HaGeo((<any>window).passed.geo, false, false) : geo;

        if (this.standalone && !(<any>window).passed.crawler)
            if (!window.matchMedia('(max-width: 639px)').matches) {
                $('body').css('display', 'none');
                //var form = $('<form action="' + this.geo.link + '" method="post"><input type="hidden" name="fullapp" value="true" /></form>');
                //$('body').append(form);
                //form.submit();
                document.cookie = "fullapp=true";
                location.href = this.geo.link;
                return;
            }

        this.editing = typeof App == 'undefined' ? false : App.haUsers.user.canEdit(this.geo);
        this.touchDevice = 'ontouchstart' in window || !!navigator.maxTouchPoints; //bind from MainApp instead, when converting from dynamically creating elements.

        var target = <WindowBasic>this.$.windowbasic;
        target.ondrop = (e) => {
            if (!this.editing)
                return;
            this.startUpload();
            this.fileUpload.dropFile(e);
            e.preventDefault();
        }

        target.ondragover = (e) => {
            if (!this.editing)
                return;
            e.stopPropagation();
            return false;
        }

        target.ondragleave = (e) => {
            if (!this.editing)
                return;
            event.stopPropagation();
            return false;
        }

        //TODO: maybe... on mobile.....
        //$(this.$.imageContainer).on('swipeleft', () => this.imageTap());

        if (typeof App != 'undefined')
            if (App.haGeos.firstGeoTour) {
                App.haGeos.firstGeoTour.close();
                App.haGeos.firstGeoTour = null;

                //TODO: continue tour............... if LocalStorage('firstGeoTourDone') is not set..........


            }
    }

    private startUpload() {
        this.uploading = true;
        if (!this.fileUpload) {
        //    $(this.fileUpload).css('display', 'flex');
        //else {
            this.fileUpload = <FileUpload>FileUpload.create(true, '*.jpg,*.png', 'target');
            this.listen(this.fileUpload, 'success', 'uploadSuccess');
            $(this.$.imageContainer).append(this.fileUpload);
        }
    }

    private uploadSuccess(result: any) {
        this.uploading = false;
        //$(this.fileUpload).css('display', 'none');
        this.push('geo.images', <HAImage>result.detail.image);
    }

    //ready() { //standalone only
    //    if (this.geo)
    //        return;

    //    this.standalone = true;
    //    this.dev = (<any>window).passed.dev;
    //    this.geo = new HaGeo((<any>window).passed.geo);
    //}

    //creator(user: HAUser, tags: any): string {
    //    if (tags.length == 0)
    //        return '';

    //    return this.geo.creator;
    //}

    isProUser(): boolean {
        return typeof App == 'undefined' ? false : App.haUsers.user.isPro;
    }

    isWriter(): boolean {
        return typeof App == 'undefined' ? false : App.haUsers.user.isWriter;
    }

    //menuIcon(editing: boolean): string {
    //    return editing ? 'more-vert' : 'add'
    //}

    notNull(object: any): boolean {
        return !!object;
    }

    showPeriodTags(length: number, editing: boolean): boolean {
        return editing || length > 0;
    }

    canReport(isUGC: boolean): boolean {
        return isUGC && !Common.standalone;
    }

    tabsTrack(e) {
        e.cancelBubble = true;
    }
    sortContents(a: HaContent, b: HaContent) {
        return a.ordering - b.ordering;
    }
    contentIsFirst(ordering: number) {
        return ordering == 1;
    }
    contentIsLast(ordering: number) {
        return ordering == this.contents.length;
    }
    tagsService(): Tags {
        return this.$.haGeoService;
    }
}

WindowGeo.register();