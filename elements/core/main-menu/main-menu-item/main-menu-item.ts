@component("main-menu-item")
class MainMenuItem extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public menuTitle: string;

    @property({ type: String })
    public icon: string;

    @property({ type: Boolean, notify: true })
    public show: boolean;

    @property({ type: Boolean })
    public immediateShow: boolean;

    @property({ type: Boolean, notify: true })
    public showMainMenu: boolean;

    showMenuItem(showMainMenu: boolean, show: boolean): boolean {
        //return showMainMenu || show;
        return true;
    }

    @observe('immediateShow')
    immediateShowChanged(newVal: boolean) {
        this.showMainMenu = !newVal;
        this.show = newVal;
    }

    @observe('show')
    showChanged(newVal: boolean) {
        this.dataset.show = newVal.toString();

        this.immediateShow = newVal;
        if (newVal)
            this.fire('shown');
    }

    //@observe('showMainMenu')
    //showMainMenuChanged() {
    //    if (this.showMainMenu)
    //        this.show = false;
    //}

    //leftIcon(show: boolean): string {
    //    return show ? 'chevron-left' : this.icon;
    //}

    //rightIcon(show: boolean): string {
    //    return show ? '' : 'chevron-right'; //help-outline
    //}
    
}

MainMenuItem.register();