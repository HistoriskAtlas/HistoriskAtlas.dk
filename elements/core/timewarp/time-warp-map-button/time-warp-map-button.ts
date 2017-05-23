@component("time-warp-map-button")
class TimeWarpMapButton extends polymer.Base implements polymer.Element {

    @property({ type: Number })
    public mode: TimeWarpModes & number;

    @property({ type: Object, notify: true })
    public map: HaMap & Object;

    @property({ type: Array })
    public maps: Array<HaMap>;

    //@property({ type: Number, notify: true })
    //public selected: number;

    //@property({ type: Number })
    //public selectedIndex: number;

    //@property({ type: String })
    //public placeholder: string;

    @property({ type: Boolean })
    public lift: boolean;

    constructor() {
        super();
        this.update();
    }
    
    @observe("maps.*")
    mapsDeepChanged(changeRecord: any) {
        if (!App.map.timeWarp.isVisible)
            return;

        if (App.map.timeWarp.mode == TimeWarpModes.CLOSING_FROM_CIRCLE || App.map.timeWarp.mode == TimeWarpModes.CLOSING_FROM_SPLIT || App.map.timeWarp.mode == TimeWarpModes.OPENING)
            return;

        var props: Array<string> = (<string>changeRecord.path).split('.');
        var property: string = props.pop();
        if (property != 'inViewTimeWarp')
            return;

        var i = props[1].substring(1);
        var map: HaMap = changeRecord.base[props[1].substring(1)];

        if (map == this.map && !changeRecord.value)
            App.toast.show('Kortet i tidsluppen er ikke længere aktuelt. Vælg et nyt.'); //TODO: Message inside timewarp instead.
    }
    
    @observe("map")
    mapChanged() {
        this.update();
    }

    //@observe("map.tagline")
    //mapTaglineChanged() {
    //    this.update();
    //}

    @listen("map-select")
    DialogMapSelect() {
        this.$.mapSelect.open();
    }

    public update() {
        this.mode = App.map.timeWarp.mode;
        (<TimeWarpButton>this.$.button).update();
    }

    public show() {
        (<TimeWarpButton>this.$.button).show();
    }

    public hide() {
        (<TimeWarpButton>this.$.button).hide();
    }

    years(start: number, end: number): string {
        return (start ? start + ' - ' : '') + end;
    }
}

TimeWarpMapButton.register();