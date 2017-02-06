class HaCollection {
    public _id: number;
    private _title: string;
    private _geos: Array<HaGeo>;
    private _online: boolean;
    private _ugc: boolean;
    private _userid: number;
    private _distance: number;
    private _type: number;
    private _content: HaContent;
    //private maps: Array<HaGeo>;
    //private _geoIds: Array<number>;
    public tags: Array<HaTag>;
    public static types: Array<string> = ['Kørsel', 'Cykling', 'Til fods']

    constructor(data: any) {
        this._geos = [];
        this.tags = [];

        if (!data)
            return;

        this._id = data.collectionid;
        this._title = data.title;
        this._online = data.online;
        this._ugc = data.ugc;
        this._distance = data.distance;
        this._type = data.type;
        this._userid = data.userid;

//if (data.collection_geos)
        //    for (var geoid of data.collection_geos) {
        //        var geo = App.haGeos.geos[geoid];
        //        if (geo)
        //            this._geos.push(geo);
        //        else
        //            this._geoIds.push(geoid);
        //    }
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

    get userid(): number {
        return this._userid;
    }

    get geos(): Array<HaGeo> {
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

        return this._geos;
    }
    set geos(val: Array<HaGeo>) {
        this._geos = val;
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
            data.userid = App.haUsers.user.id;
            data.ugc = !App.haUsers.user.isPro;
            Services.insert('collection', data, (result) => {
                this._id = result.data[0].collectionid;
                if (callback)
                    callback();
            });
        }
    }

    public saveNewGeo(geo: HaGeo) {
        Services.insert('collection_geo', { collectionid: this._id, geoid: geo.id, ordering: this.geos.indexOf(geo) }, (result) => {});
    }

    public saveProp(prop: string) {
        var data = { collectionid: this._id };
        data[prop] = this['_' + prop];
        Services.update('collection', data, (result) => { });
    }

    public removeGeo(geo: HaGeo) {
        var data: any = {
            collectionid: this._id,
            geoid: geo.id,
            deletemode: 'permanent'
        };
        Services.delete('collection_geo', data, (result) => {});
    }

    public updateOrdering(indexStart: number, indexEnd: number) {

        if (indexStart > indexEnd) {
            var temp = indexStart;
            indexStart = indexEnd;
            indexEnd = temp;
        }

        for (var i = indexStart; i <= indexEnd; i++) {
            var data: any = {
                collectionid: this._id,
                geoid: this._geos[i].id,
                ordering: i
            };
            Services.update('collection_geo', data, (result) => {});
        }
        //setTimeout(() => {
        //    for (var i = indexStart; i <= indexEnd; i++) {
        //        App.haCollections.updateIconStyle(this._geos[i]);
        //    }
        //}, 10)


        //Services.update('collection_geo', { collectionid: this._id, geoid: this._geos[indexStart].id, ordering: indexStart }, (result) => { });
        //Services.update('collection_geo', { collectionid: this._id, geoid: this._geos[indexEnd].id, ordering: indexEnd }, (result) => { });
    }

}
