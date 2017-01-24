class HaCollection {
    public _id: number;
    private _title: string;
    private _geos: Array<HaGeo>;
    //private maps: Array<HaGeo>;
    //private _geoIds: Array<number>;

    constructor(data: any) {
        this._geos = [];
        //this._geoIds = [];

        if (!data)
            return;

        this._id = data.collectionid;
        this._title = data.title;

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

    public open() {
        if (this._geos.length > 0 || !this._id) {
            this.openRouteWindow();
            return;
        }

        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this._id + '}]}]}}' }, (result) => {
            for (var data of result.data) {
                var geo = App.haGeos.geos[data.geoid];
                if (!geo)
                    continue;
                geo.title = data.title;
                this._geos.push(geo) //TODO: use notify system.............
            }
            this.openRouteWindow();
        })

    }
    private openRouteWindow() {
        if (App.windowRoute) {
            App.windowRoute.setRoute(this);
            (<WindowBasic>App.windowRoute.$.windowbasic).bringToFront();
        } else
            Common.dom.append(WindowRoute.create(this));
    }
    public save() {
        var data: any = {
            title: this._title,
        };
        if (this._id) { //TODO: not tested yet?
            data.collectionid = this._id;
            Services.update('collection', data, () => { })
        } else {
            data.userid = App.haUsers.user.id;
            Services.insert('collection', data, (result) => {
                this._id = result.data[0].collectionid;
            });
        }
    }

    public saveNewGeo(geo: HaGeo) {
        var data: any = {
            collectionid: this._id,
            geoid: geo.id,
            ordering: this.geos.indexOf(geo)
        };
        Services.insert('collection_geo', data, (result) => {
            
        });
    }

    public removeGeo(geo: HaGeo) {
        var data: any = {
            collectionid: this._id,
            geoid: geo.id,
            deletemode: 'permanent'
        };
        Services.delete('collection_geo', data, (result) => {

        });
    }

}
