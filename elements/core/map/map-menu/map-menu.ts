@component("map-menu")
class MapMenu extends polymer.Base implements polymer.Element {
    //@property({ type: Boolean, value: false })
    //public main: boolean;

    @property({ type: Object, notify:true })
    public map: HaMap & Object;

    @property({ type: Boolean, value: false })
    public lift: boolean;

    @property({ type: Boolean, notify: true })
    public drawerOpen: boolean;

    @property({ type: Boolean, value: true, notify: true })
    public showMainMenu: boolean;


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
        //this.selected = this.active ? (this.main ? 2 : 3) : null;
        //this.selected = this.active ? 0 : null;
        if (this.drawerOpen && App.mainMenu.showMenuMaps) {
            this.drawerOpen = false;
            return;
        }

        this.drawerOpen = true;
        App.mainMenu.set('showMenuMaps', true);
        this.showMainMenu = false;
    }

    //@observe("selected")
    //selectedChanged(newVal: boolean) {
    //    //this.active = this.selected == (this.main ? 2 : 3);
    //    this.active = this.selected == 0;
    //}


    cssClass(lift: boolean, drawerOpen: boolean): string {
        //return (main ? 'primary HAPrimColor' : 'HASecColor') + (lift ? ' lift' : '') + (drawerOpen ? ' responsive-nudge' : '') + (!main && mode == TimeWarpModes.SPLIT ? ' fix' : '');
        return 'primary ' + (lift ? ' lift' : '') + (drawerOpen ? ' responsive-nudge' : '');
    }

    //public setMap(haMap: HaMap) {
    //    this.set('map', haMap);
    //}

    year(startYear: number, endYear: number): string {
        return Common.years(startYear, endYear)
        //return (startYear ? startYear + ' - ' : '') + endYear;
    }
}

MapMenu.register();