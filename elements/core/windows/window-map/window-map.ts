//@component("window-map")
//class WindowMap extends polymer.Base implements polymer.Element {

//    @property({ type: Object })
//    private mapMenu: MapMenu & Object;

//    @property({ type: Object })
//    private map: HaMap & Object;

//    @property({ type: Array })
//    public maps: Array<HaMap>;

//    @property({ type: String })
//    public windowRight: string;;

//    @property({ type: String })
//    public windowLeft: string;;

//    ready() {
//        this.set('maps', App.haMaps.maps);
//    }

//    mapClass(mapMenu: MapMenu): string {
//        //return 'map' + (mapMenu.main ? ' HAPrimColor' : ' HASecColor');
//        return 'map HAPrimColor';
//    }

//    imageWrapperClass(itemMap: HaMap, map: HaMap): string {
//        return itemMap == map ? 'selectedImage' : '';
//    }

//    years(start: number, end: number): string {
//        return (start ? start + ' - ' : '') + end;
//    }

//    //public mapTapped(e: CustomEvent) {
//    //    var map = <HaMap>this.$.templateMaps.itemForElement(e.target);
//    //    this.mapMenu.setMap(map);
//    //}

//    constructor(mapMenu: MapMenu) {
//        super();
//        this.set('mapMenu', mapMenu);
//        this.set('map', mapMenu.map);

//        if (this.mapMenu.main)
//            this.set('windowLeft', 15);
//        else
//            this.set('windowRight', 15);

//        this.mapMenu.addEventListener('map-changed', (e) => {
//            this.set('map', this.mapMenu.map);
//        });
//    }
//}

//WindowMap.register();