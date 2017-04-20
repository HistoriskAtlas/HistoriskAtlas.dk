@component("ha-maps")
class HaMaps extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true, value: [] })
    public maps: Array<HaMap>;

    @property({ type: Object, notify: true })
    public mainMap: HaMap;

    @property({ type: Object, notify: true })
    public timeWarpMap: HaMap;

    //public static initMainMapId: number = 161; //Was 51
    public static initTimeWarpMapId: number = 80;
    public static defaultMap: HaMap;
    public byId: Array<HaMap>;

    ready() {
        //this.maps = [];
        this.byId = [];
        HaTags.loadedCallbacks.push(() =>
            Services.get('map', { count: 'all', sort:'{orgproductionendyear:asc}', schema: '{map:[id,name,orgproductionstartyear,orgproductionendyear,minlat,maxlat,minlon,maxlon,minz,maxz,iconcoords]}', online: true }, (result) => this.handleResponse(result.data))
            //this.$.ajax.url = Common.api + 'map.json?ispublic=true&sort={orgproductionendyear:asc}&count=all&v=1&schema={map:[id,name,orgproductionstartyear,orgproductionendyear,minlat,maxlat,minlon,maxlon,minz,maxz,iconcoords]}'
        )
    }

    public handleResponse(result: any) {
        var newMaps: Array<HaMap> = [];
        var newMap: HaMap;
        //this.$.ajax.lastResponse.data.forEach(data => {
        for (var data of result) {
            newMap = new HaMap(data);
            //if (newMap.id == Global.defaultTheme.mapid)
            //    HaMaps.defaultMap = newMap;
            //if (newMap.id == App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid)
            //    this.mainMap = newMap;
            //if (newMap.id == HaMaps.initTimeWarpMapId)
            //    this.timeWarpMap = newMap;
            newMaps.push(newMap);
            this.byId[newMap.id] = newMap;
        }
        //});

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

        HaMaps.defaultMap = this.byId[Global.defaultTheme.mapid];

        this.set('maps', newMaps);
        this.mainMap = this.byId[App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid];
        this.timeWarpMap = this.byId[HaMaps.initTimeWarpMapId];

        //this.$.selectorMain.select(this.byId[App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid]);
        //this.$.selectorTimeWarp.select(this.byId[HaMaps.initTimeWarpMapId]);

        App.map.updateExtent();
        App.map.updateExtentTimeWarp();
    }

    @observe('mainMap')
    mainMapChanged(newVal: HaMap) {
        this.$.selectorMain.select(newVal);
    }

    @observe('timeWarpMap')
    timeWarpMapChanged(newVal: HaMap) {
        this.$.selectorTimeWarp.select(newVal);
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

    public loadExtendedData(map: HaMap) {
        Services.get('map', { count: 1, schema: '{map:[licenstagid,licensee,source,about]}', id: map.id }, (result) => {
            var data = result.data[0];
            var i = this.maps.indexOf(map);
            if (data.licenstagid)
                this.set(['maps', i, 'licens'], App.haTags.byId[data.licenstagid]);
            if (data.licensee)
                this.set(['maps', i, 'licensee'], data.licensee);
            if (data.source)
                this.set(['maps', i, 'orgSource'], data.source);
            if (data.about)
                this.set(['maps', i, 'about'], data.about);

            this.notifyPath('maps.' + i + '.tagline', map.tagline);
        })
    }
}

HaMaps.register();