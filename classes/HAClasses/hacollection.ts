class HaCollection {
    private _id: number;
    private _title: string;
    private _collection_geos: Array<HaCollectionGeo>;
    private _online: boolean;
    private _ugc: boolean;
    private _cyclic: boolean;
    private _user: HAUser;
    private _distance: number;
    private _type: number;
    private _content: HaContent;

    private _selected: boolean;

    //private maps: Array<HaGeo>;
    //private _geoIds: Array<number>;
    public tags: Array<HaTag>;
    public features: Array<ol.Feature>;

    public static types: Array<string> = ['Kørsel', 'Cykling', 'Til fods']
    public static iconTypes: Array<string> = ['maps:directions-car', 'maps:directions-bike', 'maps:directions-walk']
    public static googleMapsTypes: Array<string> = ['d', 'b', 'w']

    constructor(data: any) {
        this._collection_geos = [];
        this.tags = [];
        this.features = [];

        if (!data)
            return;

        this._id = data.collectionid;
        this._title = data.title;
        this._online = data.online;
        this._ugc = data.ugc;
        this._cyclic = data.cyclic;
        this._distance = data.distance;
        this._type = data.type;

        if (data.userid == App.haUsers.user.id) {
            this._user = App.haUsers.user;
        } else
            this._user = new HAUser({ id: data.userid } );

        //this._userid = data.userid;

        if (data.collection_geos) {
            var collection_geos = (<Array<any>>data.collection_geos).sort((a, b) => a.ordering - b.ordering);

            for (var collection_geo of collection_geos) {
                this._collection_geos.push(new HaCollectionGeo(collection_geo))
                //var geo = App.haGeos.geos[collection_geo.geoid];
                //if (geo)
                //    this._geos.push(geo);
            }
        }
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }
    set title(val: string) {
        this._title = val;
    }

    get online(): boolean {
        return this._online;
    }
    set online(val: boolean) {
        this._online = val;
    }

    get ugc(): boolean {
        return this._ugc;
    }

    get cyclic(): boolean {
        return this._cyclic;
    }
    set cyclic(val: boolean) {
        this._cyclic = val;
    }

    get distance(): number {
        return this._distance;
    }
    set distance(val: number) {
        this._distance = val;
    }
    public static formatDistance(distance: number): string {
        return distance < 1000 ? distance + ' m' : (distance / 1000).toFixed(1) + ' km';
    }

    get content(): HaContent {
        return this._content;
    }
    set content(val: HaContent) {
        this._content = val;
    }

    get type(): number {
        return this._type;
    }
    set type(val: number) {
        this._type = val;
    }

    get user(): HAUser {
        return this._user;
    }
    set user(val: HAUser) {
        this._user = val;
    }

    get selected(): boolean {
        return this._selected;
    }
    set selected(val: boolean) {
        this._selected = val;
    }

    public get isUGC(): boolean {
        return this._ugc;
    }

    public get isWalk(): boolean {
        return this._type == 2;
    }

    get collection_geos(): Array<HaCollectionGeo> {
        //if (this._geoIds.length > 0) {
        //    var newGeoIds: Array<number> = [];
        //    for (var geoid of this._geoIds) {
        //        var geo = App.haGeos.geos[geoid];
        //        if (geo)
        //            this._geos.push(geo)
        //        else
        //            newGeoIds.push(geoid)
        //    }
        //    this._geoIds = newGeoIds;
        //}

        return this._collection_geos;
    }

    public get link(): string {
        return location.protocol + '//' + location.hostname + (!location.port ? '' : (':' + location.port)) + '/' + (this._title ? this._title.replace(new RegExp(' |/', 'g'), '_') : '') + '_(r' + this._id + ')';
    }
    //set geos(val: Array<HaCollectionGeo>) {
    //    this.collection_geos = val;
    //}

    public collectionGeoOrdering(geo: HaGeo): number {
        var i = 0;
        for (var cg of this._collection_geos) {
            if (cg.geo == geo)
                return i;
            if (!cg.isViaPoint)
                i++;
        }
    }

    //public viaPointLocalOrdering(geo: HaGeo): number {
    //    var i = 0;
    //    for (var g of this._geos) {
    //        if (g == geo)
    //            return i;
    //        if (g.id > 0)
    //            i = 0;
    //        else
    //            i++;
    //    }
    //}
    public viaPointOrdering(geo: HaGeo): number {
        var i = 0;
        for (var cg of this._collection_geos) {
            if (cg.geo == geo) {
                if (!cg.showOnMap)
                    return -1;

                if (this.id == 516) //digterruter hack (Carit Etlar)... 
                    switch (i + 1) {
                        case 2: i = 5 - 1; break;
                        case 5: i = 2 - 1; break;
                        case 3: i = 6 - 1; break;
                        case 6: i = 3 - 1; break;
                        case 8: i = 9 - 1; break;
                        case 9: i = 8 - 1; break;
                    }

                return i;
            }
            if (cg.isViaPoint && cg.showOnMap)
                i++;
        }
    }

    public get viaPointCount(): number {
        var i = 0;
        for (var cg of this._collection_geos)
            if (!cg.geo)
                i++;
        return i;
    }


    //public open() {
    //    //if (this._geos.length > 0 || !this._id) {
    //        App.haCollections.select(this);
    //    //    return;
    //    //}

    //    //Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this._id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, (result) => {
    //    //    for (var data of result.data) {
    //    //        var geo = App.haGeos.geos[data.geoid];
    //    //        if (!geo)
    //    //            continue;
    //    //        geo.title = data.title;
    //    //        this._geos.push(geo) //TODO: use notify system.............
    //    //    }
    //    //    App.haCollections.select(this);
    //    //})

    //}
    //private openRouteWindow() {
    //    if (App.windowRoute) {
    //        App.windowRoute.setRoute(this);
    //        (<WindowBasic>App.windowRoute.$.windowbasic).bringToFront();
    //    } else
    //        Common.dom.append(WindowRoute.create(this));
    //}
    public save(callback?: () => void) {
        if (this._id) { //TODO: not tested yet? in use?
            var data = Common.formData({ title: this._title });
            Services.HAAPI_PUT('collection', this._id, {}, data, () => {
                if (callback)
                    callback();
            });
        } else {
            var data = Common.formData({ title: this._title, ugc: this._ugc, online: this._online, type: this._type, distance: this._distance, cyclic: this._cyclic });
            Services.HAAPI_POST('collection', {}, data, (result) => {
                this._id = result.data.collectionid;
                if (callback)
                    callback();
            });
        }
    }

    public saveNewCollectionGeo(collection_geo: HaCollectionGeo) {
        var coord = Common.fromMapCoord(collection_geo.coord);
        var data = Common.formData({ collectionid: this._id, ordering: collection_geo.ordering, showonmap: collection_geo.showOnMap, calcroute: collection_geo.calcRoute, latitude: coord[1], longitude: coord[0] });
        if (!collection_geo.isViaPoint)
            data.set('geoid', collection_geo.geo.id.toString());

        Services.HAAPI_POST('collectiongeo', {}, data, (result) => collection_geo.id = result.data.collectiongeoid);
    }

    public saveProp(prop: string) {
        var formData = new FormData();
        formData.append(prop, this['_' + prop]);
        Services.HAAPI_PUT('collection', this._id, {}, formData, (result) => {
            if (prop == 'online')
                App.toast.show('Ruten nu ' + (this._online ? '' : 'af') + 'publiceret');
        });
    }

    public removeCollectionGeo(collection_geo: HaCollectionGeo) {
        Services.HAAPI_DELETE('collectiongeo', collection_geo.id);
    }

    //public updateOrdering(indexStart: number, indexEnd: number) {

    //    if (indexStart > indexEnd) {
    //        var temp = indexStart;
    //        indexStart = indexEnd;
    //        indexEnd = temp;
    //    }

    //    for (var i = indexStart; i <= indexEnd; i++) {
    //        //if (this._collection_geos[i].geo.id == 0)
    //        //    continue;

    //        var data: any = {
    //            collectionid: this._id,
    //            //geoid: this._collection_geos[i].geo.id,
    //            ordering: this._collection_geos.indexOf(this.collection_geos[i])
    //        };
    //        Services.update('collection_geo', data, (result) => { });
    //    }
    //    //setTimeout(() => {
    //    //    for (var i = indexStart; i <= indexEnd; i++) {
    //    //        App.haCollections.updateIconStyle(this._geos[i]);
    //    //    }
    //    //}, 10)


    //    //Services.update('collection_geo', { collectionid: this._id, geoid: this._geos[indexStart].id, ordering: indexStart }, (result) => { });
    //    //Services.update('collection_geo', { collectionid: this._id, geoid: this._geos[indexEnd].id, ordering: indexEnd }, (result) => { });
    //}

    public updateOrdering(indexEnd: number) {
        var collection_Geo = this.collection_geos[indexEnd];

        if (indexEnd == 0) {
            collection_Geo.ordering = Math.round(this.collection_geos[1].ordering / 2);
        } else {
            if (indexEnd == this.collection_geos.length - 1)
                collection_Geo.ordering = this.collection_geos[this.collection_geos.length - 2].ordering + Math.round(HaCollectionGeo.orderingGap);
            else
                collection_Geo.ordering = Math.round((this.collection_geos[indexEnd - 1].ordering + this.collection_geos[indexEnd + 1].ordering) / 2);
        }

        Services.HAAPI_PUT('collectiongeo', collection_Geo.id, {}, Common.formData({ ordering: collection_Geo.ordering })); //UNTESTED! Sortable bug?
    }

    public showOnMap(anim: boolean = true, forSave: boolean = false) {

        if (this._collection_geos.length == 0)
            return;

        if (this._collection_geos.length == 1) {
            App.map.center(this.collection_geos[0].coord, 10000, true, true, true, anim);
            return;
        }

        var extent = ol.extent.createEmpty();
        for (var feature of this.features)
            ol.extent.extend(extent, feature.getGeometry().getExtent());


        //var minLon: number = Number.MAX_VALUE;
        //var maxLon: number = Number.MIN_VALUE;
        //var minLat: number = Number.MAX_VALUE;
        //var maxLat: number = Number.MIN_VALUE;

        //for (var cg of this._collection_geos) {
        //    if (cg.coord[1] < minLat)
        //        minLat = cg.coord[1];
        //    if (cg.coord[1] > maxLat)
        //        maxLat = cg.coord[1];
        //    if (cg.coord[0] < minLon)
        //        minLon = cg.coord[0];
        //    if (cg.coord[0] > maxLon)
        //        maxLon = cg.coord[0];
        //}

        var minLon = extent[0];
        var minLat = extent[1];
        var maxLon = extent[2];
        var maxLat = extent[3];


        var coord = [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
        var size = App.map.getSize();
        var val = forSave ? Math.max((maxLon - minLon) / size[0], (maxLat - minLat) / size[1]) * 1.1 : Math.max((maxLon - minLon) * 1.8, (maxLat - minLat) * 1.5) / 2;

        App.map.center(coord, val, true, !forSave, true, anim);
        if (forSave)
            App.map.renderSync();
    }

    public delete() {
        Services.HAAPI_DELETE('collection', this._id, false, {}, (result) => App.toast.show('Ruten er slettet.'));
    }

}
