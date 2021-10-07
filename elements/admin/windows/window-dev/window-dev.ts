@component("window-dev")
class WindowDev extends polymer.Base implements polymer.Element {
    private curPage: number;
    private pageSize: number = 500;

    //updatePrimaryTagsAndUGCs() {
    //    if (!confirm("WARNING! This will reset all primary tags and UGC on all geos. Any manually set tags will be reset! Continue?"))
    //        return;

    //    this.curPage = 0;
    //    this.getPage();
    //}

    //insertHADestinations() {
    //    var geoIDsWidthDestination: Array<number>;
    //    Services.get('geo', {
    //        count: '*',
    //        tag_geos: JSON.stringify([{ tagid: 427 }]),
    //        schema: JSON.stringify({
    //            geo: {
    //                fields: [{ collapse: 'id'}],
    //                filters: [{
    //                    created: { min: '2016-06-30' }
    //                }]
    //            }
    //        })
    //    }, (data) => {
    //        geoIDsWidthDestination = data.data
    //        Services.get('geo', {
    //            count: '*',
    //            schema: JSON.stringify({
    //                geo: {
    //                    fields: [{ collapse: 'id' }],
    //                    filters: [{
    //                        created: { min: '2016-06-30' }
    //                    }]
    //                }
    //            })
    //        }, (data) => {
    //            this.insertHADestination(data.data, geoIDsWidthDestination);
    //        })
    //    })
    //}

    //private insertHADestination(geoIds: Array<number>, geoIDsWidthDestination: Array<number>) {
    //    var geoid = geoIds.pop();

    //    if (geoIDsWidthDestination.indexOf(geoid) == -1) {
    //        Services.insert('tag_geo', { tagid: 427, geoid: geoid, userid: 5 }, (data) => {
    //            if (geoIds.length > 0)
    //                this.insertHADestination(geoIds, geoIDsWidthDestination);
    //        })
    //    } else
    //        if (geoIds.length > 0)
    //            this.insertHADestination(geoIds, geoIDsWidthDestination);
    //}

    //private getPage() {
    //    Services.get('geo', {
    //        count: this.pageSize,
    //        offset: this.curPage * this.pageSize,
    //        sort: '{id:asc}',
    //        schema: JSON.stringify({
    //            geo: {
    //                fields: ['id', 'title', 'lat', 'lng', 'ptid', 'online',
    //                    {
    //                        tag_geos: ['empty', { "collapse": "tagid" }]
    //                    }
    //                ]
    //            }
    //        })
    //    }, (data) => {
    //        this.updatePrimaryTagAndUGC(data.data, data.data.length == this.pageSize)
    //    })
    //}

    //private updatePrimaryTagAndUGC(geos: Array<any>, moreToCome: boolean) {
    //    if (geos.length == 0) {
    //        if (moreToCome) {
    //            this.curPage++;
    //            this.getPage();
    //            return;
    //        }

    //        alert('done!')
    //        return;
    //    }

    //    var data = geos.pop();
    //    var geo = new HaGeo(data, false, false);
    //    if (data.tag_geos) 
    //        for (var tagID of data.tag_geos)
    //            geo.addTag(App.haTags.byId[tagID])

    //    var primTag = geo.getNewPrimaryTag;
    //    Services.update('geo', { primarytagid: primTag ? primTag.id : null, ugc: geo.institutionTags.length == 0, geoid: geo.id }, () => {
    //        this.updatePrimaryTagAndUGC(geos, moreToCome);
    //    });
    //}
}

WindowDev.register();