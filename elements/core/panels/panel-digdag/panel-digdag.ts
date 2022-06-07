@component("panel-digdag")
class PanelDigDag extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    private digdags: Array<HARegionTypeCategory>;

    @property({ type: Object, notify: true, value: null })
    private type: HARegionType & Object;

    @property({ type: Number, notify: true })
    private year: number;

    @property({ type: Boolean })
    public touchDevice: boolean;

    private childDownTimeout: any;

    digdagTap(e: any) {
        e.model.set('digdag.showChildren', !e.model.digdag.showChildren);
    }

    childTap(e: any) {
        if (this.year < e.model.child.periodStart)
            this.year = e.model.child.periodStart;

        if (this.year > e.model.child.periodEnd)
            this.year = Math.min(e.model.child.periodEnd, Common.digDagEndYear);

        e.model.set('child.active', true);
        this.type = e.model.child;
        clearTimeout(this.childDownTimeout);
    }
    childDown(e: any) {
        if (this.touchDevice && e.model.child.regionTypeCategory.id != 7)
            this.childDownTimeout = setTimeout(() => Common.dom.append(WindowRegionType.create(e.model.child)), 750);
    }

    infoTap(e: any) {
        Common.dom.append(WindowRegionType.create(e.model.child));
        e.cancelBubble = true;
    }

    disabledTap() {
        if (this.type == null)
            return;

        this.update(null);
        this.type = null;
    }

    years(start: number, end: number): string {
        return Common.years(start, end);
    }

    disabled(type: HARegionType): boolean {
        return type == null;
    }

    showInfoButton(touchDevice: boolean, digdag: HARegionTypeCategory): boolean {
        return !touchDevice && digdag.id != 7;
    }
//radioTap(e: any) {
    //    if (e.model.child.active)
    //        return;

    //    this.update(e.model.child);
    //}
    classListItem(year: number, regionType: HARegionType): string {
        return 'listitem listsubitem noselect' + ((year < regionType.periodStart || year > regionType.periodEnd) ? ' inactive' : '');
    }

    @observe("type")
    typeChanged(newVal: HARegionType) {
        this.update(newVal);
    }

    private update(activeRegionType: HARegionType) {
        if (!this.digdags)
            return;
        if (activeRegionType)
            App.map.showDigDagLayer(activeRegionType.name);
        else
            App.map.hideDigDagLayer();
        this.digdags.forEach((digdag: HARegionTypeCategory, i: number) =>
            digdag.regionTypes.forEach((regionType: HARegionType, j: number) => {
                if (regionType != activeRegionType)
                    this.set('digdags.' + i + '.regionTypes.' + j + '.active', false); //Needed this path?
            })
        )
    }
}

PanelDigDag.register();