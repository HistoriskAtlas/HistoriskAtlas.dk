class HaCollection {
    public _id: number;
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
                return cg.showOnMap ? i : -1;
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
        var data: any = {
            title: this._title,
        };
        if (this._id) { //TODO: not tested yet?
            data.collectionid = this._id;
            Services.update('collection', data, () => {
                if (callback)
                    callback();
            })
        } else {
            data.userid = this.user.id;
            data.ugc = this._ugc;
            data.online = this._online;
            data.type = this._type;
            data.distance = this._distance;
            data.cyclic = this._cyclic;
            Services.insert('collection', data, (result) => {
                this._id = result.data[0].collectionid;
                if (callback)
                    callback();
            });
        }
    }

    public saveNewCollectionGeo(collection_geo: HaCollectionGeo) {
        var coord = Common.fromMapCoord(collection_geo.coord);
        var send: any = { collectionid: this._id, ordering: collection_geo.ordering, showonmap: collection_geo.showOnMap, calcroute: collection_geo.calcRoute, latitude: coord[1], longitude: coord[0] };
        if (!collection_geo.isViaPoint)
            send.geoid = collection_geo.geo.id;
        Services.insert('collection_geo', send, (result) => {
            collection_geo.id = result.data[0].collectiongeoid;
        });
    }

    public saveProp(prop: string) {
        var data = { collectionid: this._id };
        data[prop] = this['_' + prop];
        Services.update('collection', data, (result) => {
            if (prop == 'online')
                App.toast.show('Turforslaget er nu ' + (this._online ? '' : 'af') + 'publiceret');
        });
    }

    public removeCollectionGeo(collection_geo: HaCollectionGeo) {
        var data: any = {
            collectiongeoid: collection_geo.id,
            deletemode: 'permanent'
        };
        Services.delete('collection_geo', data, (result) => { });
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
                collection_Geo.ordering = this.collection_geos[this.collection_geos.length - 1].ordering + Math.round(HaCollectionGeo.orderingGap / 2);
            else
                collection_Geo.ordering = Math.round((this.collection_geos[indexEnd - 1].ordering + this.collection_geos[indexEnd + 1].ordering) / 2);
        }

        Services.update('collection_geo', { id: collection_Geo.id, ordering: collection_Geo.ordering }, (result) => { });
    }

    public showOnMap() {

        if (this._collection_geos.length == 0)
            return;

        //for (var geo of this.geos) {

        //}

        if (this._collection_geos.length == 1) {
            App.map.centerAnim(this.collection_geos[0].coord, 10000, true);
            return;
        }

        var minLon: number = Number.MAX_VALUE;
        var maxLon: number = Number.MIN_VALUE;
        var minLat: number = Number.MAX_VALUE;
        var maxLat: number = Number.MIN_VALUE;

        for (var cg of this._collection_geos) {
            if (cg.coord[1] < minLat)
                minLat = cg.coord[1];
            if (cg.coord[1] > maxLat)
                maxLat = cg.coord[1];
            if (cg.coord[0] < minLon)
                minLon = cg.coord[0];
            if (cg.coord[0] > maxLon)
                maxLon = cg.coord[0];
        }

        App.map.centerAnim([(minLon + maxLon) / 2, (minLat + maxLat) / 2], Math.max((maxLon - minLon) * 1.8, (maxLat - minLat) * 1.5) / 2, true);
    }

    public delete() {
        Services.delete('collection', { collectionid: this._id, deletemode: 'permanent' }, (result) => {
            App.toast.show('Turforslaget er slettet.');
        })
    }

}
