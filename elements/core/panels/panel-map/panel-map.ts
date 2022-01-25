@component("panel-map")
class PanelMap extends polymer.Base implements polymer.Element {

    //@property({ type: Boolean, value: false })
    //private main: boolean;

    @property({ type: Object, notify: true })
    private map: HaMap & Object;

    @property({ type: Object, notify: true })
    private timeWarpMap: HaMap & Object;

    @property({ type: Array })
    public maps: Array<HaMap>;

    @property({ type: Number, notify: true })
    public year: number;
    
    @property({ type: Number, notify: true })
    public timeWarpYear: number;

    @property({ type: Number })
    public hillshade: number;

    @property({ type: Boolean, value: true })
    private filter: boolean;

    @property({ type: Boolean })
    private timeWarpActive: boolean;

    //mapClass(main: boolean): string {
    //    return 'map' + (main ? ' HAPrimColor' : ' HASecColor');
    //}

    //imageWrapperClass(itemMap: HaMap, map: HaMap): string {
    //    return itemMap == map ? 'selectedImage' : '';
    //}

    @observe('hillshade')
    hillshadeChanged() {
        if (App.map)
            App.map.hillshade.update(this.hillshade);
    }

    //@observe('extent')
    //extentChanged() {
    //    alert(this.extent[0])
    //}

    @listen('hillshadeText.tap')
    hillshadeTextTap() {
        this.$.hillshadeSlider.value = this.hillshade ? 0.0 : 1.0; //0.3
    }

    years(start: number, end: number): string {
        return (start ? start + ' - ' : '') + end;
    }

    //public mapTapped(e: CustomEvent) {
    //    var map = <HaMap>this.$.templateMaps.itemForElement(e.target);
    //    this.set('map', map);
    //}

    //primary(main: boolean): string {
    //    return main ? 'primary' : '';
    //}

    backgroundStyle(url: string): string {
        return "background-image: linear-gradient(to right, rgba(255,255,255,1.0), rgba(255,255,255,0.7), rgba(255,255,255,0.0)), url('" + url + "')"; /*rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.0))*/
    }

    active(item: HaMap, map: HaMap): boolean {
        return item == map;
    }

    visible(inView: boolean, filter: boolean): boolean {
        return filter ? inView : true;
    }

    itemTap(e: any) {
        var map = <HaMap>e.model.item;
        this.set('map', map);
    }

    timeWarpItemTap(e: any) {
        var map = <HaMap>e.model.item;
        e.cancelBubble = true;
        this.set('timeWarpMap', map);
    }
}

PanelMap.register();