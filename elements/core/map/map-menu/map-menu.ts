@component("map-menu")
class MapMenu extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, value: false })
    public main: boolean;

    @property({ type: Object, notify: true })
    public map: HaMap & Object;

    @property({ type: Object, notify: true })
    private regionType: HARegionType & Object;

    @property({ type: Object, notify: true })
    public theme: ITheme;    

    @property({ type: Array })
    public selectedTagNames: Array<string>;

    @property({ type: String })
    public selectedCollectionNames: string;

    @property({ type: Boolean, value: false })
    public lift: boolean;

    @property({ type: Boolean, notify: true })
    public drawerOpen: boolean;

    @property({ type: Boolean, value: true, notify: true })
    public showMainMenu: boolean;

    @property({ type: Boolean })
    public timeWarpActive: boolean;

    @property({ type: Number })
    public timeWarpMode: TimeWarpModes;

    //@property({ type: Number, notify: true })
    //public selected: number; //2 or 3

    //@property({ type: Boolean })
    //public active: boolean;

    @property({ type: Boolean, value: true })
    public raised: boolean;

    //@property({ type: Number, value: 0 })
    //public mode: TimeWarpModes & number;

    //private cssClassButton: string = this.main ? 'HAPrimColor' : 'HASecColor';
    //private cssClassSpacer: string = 'spacer' + (this.main ? ' HAInvertedPrimColor' : ' HAInvertedSecColor');
    //private cssClassWrapper: string = 'wrapper ' + (this.main ? 'wrapperLeft HAPrimColor' : 'wrapperRight HASecColor');

    //ready() {
    //    //this.raised = !this.main;
    //    this.raised = true;
    //}

    //@listen("button.mouseover")
    //buttonMouseover() {
    //    if (this.main)
    //        this.raised = true;
    //}

    //@listen("button.mouseout")
    //buttonMouseout() {
    //    if (this.main)
    //        this.raised = false;
    //}

    //@listen("button.tap")
    //tap() {
    //    //$('body').append(WindowMap.create(this));
    //}

    //@listen("buttonSubject.tap")
    //tapSubject() {
    //    $('body').append(WindowSubject.create(this));
    //}

    //@observe("active")
    //activeChanged(newVal: boolean) {
    //    this.selected = newVal ? '3' : null;
    //}

    @listen("button.tap")
    buttonTap() {
        if (!this.main)
        {
            this.fire('map-select');
            return;
        }

        this.toggleDrawer('showMenuMaps');
    }

    buttonDigDagTap(e: any) {
        if (e.target.localName == 'iron-icon')
            this.regionType = null;
        else
            this.toggleDrawer('showMenuDigDag');
    }

    buttonSubjectsTap(e: any) {
        if (e.target.localName == 'iron-icon')
            App.haTags.toggleTop(9, false);
        else
            this.toggleDrawer('showMenuSubjects');
    }

    buttonPeriodsTap(e: any) {
        if (e.target.localName == 'iron-icon')
            App.haTags.toggleTop(10, false);
        else
            this.toggleDrawer('showMenuPeriods');
    }

    buttonCollectionsTap(e: any) {
        if (e.target.localName == 'iron-icon')
            App.haCollections.deselectAll();
        else
            this.toggleDrawer('showMenuRoutes');
    }

    buttonThemeTap(e: any) {
        if (e.target.localName == 'iron-icon')
            this.theme = Global.defaultTheme;
        else
            this.toggleDrawer('showMenuThemes');
    }

    private toggleDrawer(showMenu: string) {
        if (this.drawerOpen && App.mainMenu[showMenu]) {
            this.drawerOpen = false;
            return;
        }

        this.drawerOpen = true;
        App.mainMenu.set(showMenu, true);
        this.showMainMenu = false;
    }

    cssClass(main: boolean, lift: boolean, drawerOpen: boolean, timeWarpActive: boolean, timeWarpMode: TimeWarpModes): string {
        //return (main ? 'primary HAPrimColor' : 'HASecColor') + (lift ? ' lift' : '') + (drawerOpen ? ' responsive-nudge' : '') + (!main && mode == TimeWarpModes.SPLIT ? ' fix' : '');
        return (main ? 'main' : 'warp') + (lift ? ' lift' : '') + ((drawerOpen && main) ? ' responsive-nudge' : '') + ((timeWarpActive && timeWarpMode == TimeWarpModes.SPLIT) ? ' time-warp-active' : '');
    }

    buttonClass(main: boolean) {
        return main ? "" : "HASecColor";
    }

    //public setMap(haMap: HaMap) {
    //    this.set('map', haMap);
    //}

    year(startYear: number, endYear: number): string {
        return Common.years(startYear, endYear)
        //return (startYear ? startYear + ' - ' : '') + endYear;
    }

    classDigDag(regionType: HARegionType): string {
        return !!regionType ? '' : 'collapsed';
    }

    classTheme(theme: ITheme): string {
        return theme.linkname != 'default' ? '' : 'collapsed';
    }

    classTags(category: number): string {
        return !!this.selectedTagNames[category] ? '' : 'collapsed';
    }

    classCollections(selectedCollectionNames: string): string {
        return !!selectedCollectionNames ? '' : 'collapsed';
    }

    TagNames(category: number): string {
        return this.selectedTagNames[category];
    }


    //text(map: HaMap, licensee: string, orgSource: string, about: string): string {
    //    var result = [];
    //    if (map.licens)
    //        result.push('Licens: ' + map.licens.plurName + (licensee ? ' ' + licensee : ''))
    //    if (orgSource)
    //        result.push('Kilde: ' + orgSource)
    //    if (about)
    //        result.push(about)
    //    return result.join(' - ');
    //}
}

MapMenu.register();