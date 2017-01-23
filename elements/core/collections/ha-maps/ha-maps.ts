@component("ha-maps")
class HaMaps extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public maps: Array<HaMap>;

    @property({ type: Object, notify: true })
    public mainMap: HaMap & Object;

    @property({ type: Object, notify: true })
    public timeWarpMap: HaMap & Object;

    //public static initMainMapId: number = 161; //Was 51
    public static initTimeWarpMapId: number = 80;
    public static defaultMap: HaMap;
    public byId: Array<HaMap>;

    ready() {
        this.maps = [];
        this.byId = [];
        this.$.ajax.url = Common.api + 'map.json?ispublic=true&sort={orgproductionendyear:asc}&count=all&v=1&schema={map:[id,name,orgproductionstartyear,orgproductionendyear,ispublic,minlat,maxlat,minlon,maxlon,minz,maxz,iconcoords]}'
    }

    public handleResponse() {
        var newMaps: Array<HaMap> = [];
        var newMap: HaMap;
        this.$.ajax.lastResponse.data.forEach(data => {
            newMap = new HaMap(data);
            //if (newMap.id == Global.defaultTheme.mapid)
            //    HaMaps.defaultMap = newMap;
            //if (newMap.id == App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid)
            //    this.mainMap = newMap;
            //if (newMap.id == HaMaps.initTimeWarpMapId)
            //    this.timeWarpMap = newMap;
            newMaps.push(newMap);
            this.byId[newMap.id] = newMap;
        });

        HaMaps.defaultMap = this.byId[Global.defaultTheme.mapid];
        this.mainMap = this.byId[App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid];
        this.timeWarpMap = this.byId[HaMaps.initTimeWarpMapId];

        if (App.isDev) {
            //newMaps.push(new HaMap({ id: 42000, name: 'Mapquest OSM', orgproductionendyear: 2016}))
            newMaps.push(new HaMap({ id: 42001, name: 'Stamen Watercolor', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42002, name: 'CartoDB Light', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42003, name: 'CartoDB Dark', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42004, name: 'HOT style', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42005, name: 'HERE standard', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42006, name: 'HERE fleet', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42007, name: 'HERE flame', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42008, name: 'HERE mini', orgproductionendyear: 2016 }))
            newMaps.push(new HaMap({ id: 42009, name: 'HERE aerial', orgproductionendyear: 2016 }))
        }

        this.maps = newMaps;
    }

    public updateInView(extent: ol.Extent, param: string = '.inView') {
        //var zoom2 = App.map.getView().getZoom();
        var res = App.map.getView().getResolution();
        var w = (20037508.34 * 2) / 256;
        var zoom = Math.log(w / res) / Math.LN2;
        this.maps.forEach((map: HaMap) => {
            var prop = 'maps.' + this.maps.indexOf(map) + param;
            if (!(extent[0] < map.maxLon && extent[1] < map.maxLat && extent[2] > map.minLon && extent[3] > map.minLat))
                this.set(prop, false)
            else 
                this.set(prop, zoom < map.maxZ && zoom > map.minZ)
        })
    }
}

HaMaps.register();