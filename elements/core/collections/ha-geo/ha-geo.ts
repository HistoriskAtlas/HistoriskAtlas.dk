@component("ha-geo")
class HaGeoService extends Tags implements polymer.Element {

    private ignoreChanges: boolean = true;

    @property({ type: Object, notify: true })
    public geo: Object & HaGeo;

    @property({ type: Object })
    public params: Object;

    @property({ type: Boolean })
    public editing: boolean;

    //@property({ type: Number, notify: true })
    //public noMissingTags: number;

    //ready() {
    //    this.$.ajax.url = Common.api + 'geo.json';
    //}

    //geoid,title,intro,primarytagstatic,freetags,yearstart,yearend,latitude,longitude,online,views,deleted,{user:[id,firstname,lastname,about,{user_institutions:[{institution:[id,tagid]}]}]},{geo_image:[empty,ordering,{image:[imageid,text,year,yearisapprox,photographer,licensee,userid,{tag_images:[{collapse:id}]}]}]},{tag_geos:[{tag:[tagid,plurname,singname,category,yearstart,yearend,{parents:[empty,{collapse:{parent:id}}]}]}]}

    @observe("geo")
    geoChanged(newVal: number, oldVal: number) {
        this.initTags('geo'/*, this.geo.id*/);
        if (!this.geo.id)
            return;
        this.ignoreChanges = true;
        //var schema = 'geoid,title,intro,primarytagstatic,freetags,yearstart,yearend,latitude,longitude,online,views,deleted,{user:[id,firstname,lastname,about,{user_institutions:[{institution:[id,tagid]}]}]},{geo_image:[empty,ordering,{image:[imageid,text,year,yearisapprox,photographer,licensee,userid,{tag_images:[' + (typeof App == 'undefined' ? Common.apiSchemaTags : '{collapse:id}') + ']}]}]}';
        //if (this.geo.tags.length == 0) //&& typeof App == 'undefined'
        //    schema += ',{tag_geos:[' + Common.apiSchemaTags + ']}'; //TODO: only needed to get ids when in app mode.............................
        //    //schema += ',{tag_geos:[empty,{collapse:tagid}]}'
        //this.set('params', {
        //    'v': 1,
        //    'sid': (<any>document).sid,
        //    'geoid': this.geo.id,
        //    'schema': '{geo:[' + schema + ']}'
        //});
        //this.$.ajax.generateRequest();

        //if (this.tagIdsInStorage.length > 0)
        //    params.after = LocalStorage.timestampDateTime('tag-ids');
        Services.HAAPI_GET(`geo/${this.geo.id}`, { schema: Common.standalone ? 'standalonegeowindow' : 'geowindow' }, (result) => this.handleResponse(result.data))
    }
    
    @observe("geo.title")
    titleChanged(newVal: string) {
        this.notifyPath('geo.link', this.geo.link);
        if (newVal && !this.ignoreChanges)
            Services.HAAPI_PUT('geo', this.geo.id, {}, Common.formData({ title: this.geo.title }));
    }

    @observe("geo.intro")
    introChanged(newVal: string) {
        if (newVal && !this.ignoreChanges)
            Services.HAAPI_PUT('geo', this.geo.id, {}, Common.formData({ intro: this.geo.intro }));
    }

    @observe("geo.online")
    onlineChanged() {
        if (!this.ignoreChanges)
            Services.HAAPI_PUT('geo', this.geo.id, {}, Common.formData({ online: this.geo.online }), () => {
                this.geo.icon.updateStyle();
                App.toast.show('Fortællingen er nu ' + (this.geo.online ? '' : 'af') + 'publiceret');
            });
    }

    @observe("geo.images.splices")
    imagesArrayChanged(change: ChangeRecord<HAImage>) {
        if (this.ignoreChanges || !change)
            return;

        for (var indexSplice of change.indexSplices) {
            //for (var image of indexSplice.removed)
            //    Services.delete('geo_image', { imageid: image.id, geoid: this.geo.id });
            for (var i = 0; i < indexSplice.addedCount; i++)
                Services.HAAPI_POST('geoimage', {}, Common.formData({ imageid: this.geo.images[indexSplice.index + i].id, geoid: this.geo.id, ordering: 0 }));

            if (indexSplice.addedCount > 0) {
                var index = 0;
                for (var image of this.geo.images) {
                    if (image.ordering != index) {
                        image.ordering = index;
                        Services.HAAPI_PUT('geoimage', null, { geoid: this.geo.id, imageid: image.id }, Common.formData({ ordering: image.ordering }));
                    }
                    index++;
                }

            }


        }
    }

    @observe("geo.tags.splices")
    tagsArrayChanged(change: ChangeRecord<HaTag>) {
        if (this.ignoreChanges || !change)
            return;

        var primaryTagRemoved: boolean = false;
        if (change.indexSplices[0].removed.length > 0)
            if (change.indexSplices[0].removed[0] == this.geo.primaryTag) {
                this.set('geo.primaryTagStatic', false);
                primaryTagRemoved = true;
            }

        if (!this.geo.primaryTagStatic || primaryTagRemoved) {
            var oldPrimaryTag = this.geo.primaryTag;
            var newPrimaryTag = this.geo.getNewPrimaryTag;

            if (oldPrimaryTag != newPrimaryTag)
                this.set('geo.primaryTag', newPrimaryTag);
        }
        //this.geo.primaryTag = this.geo.getNewPrimaryTag;
        //if (oldPrimaryTag != this.geo.primaryTag) {
        //    this.geo.icon.updateStyle();
        //    if (this.geo.primaryTag) //TODO: Fix bug on API... how to set value to NULL?.......................................
        //        Services.update('geo', { primarytagid: this.geo.primaryTag.id, geoid: this.geo.id });
        //}
    }

    public setPrimaryTag(tag: HaTag) {
        this.set('geo.primaryTag', tag);
        if (!this.geo.primaryTagStatic) {
            this.set('geo.primaryTagStatic', true);
        }
    }
    @observe("geo.primaryTag")
    primaryTagChanged() {
        if (this.ignoreChanges)
            return;

        this.geo.icon.updateStyle();
        Services.HAAPI_PUT('geo', this.geo.id, {}, Common.formData({ primarytagid: this.geo.primaryTag ? this.geo.primaryTag.id : '\0' }));
    }
    @observe("geo.primaryTagStatic")
    primaryTagStaticChanged() {
        if (this.ignoreChanges)
            return;

        Services.HAAPI_PUT('geo', this.geo.id, {}, Common.formData({ primarytagstatic: this.geo.primaryTagStatic }));
    }

    public handleResponse(data) {
        this.ignoreChanges = true;
        //var data = this.$.ajax.lastResponse.data[0];
        
        if (typeof App == 'undefined')
            this.set('geo.shown', true);

        this.set('geo.title', data.title);
        this.set('geo.intro', data.intro);
        this.set('geo.user', new HAUser(data.user));
        this.set('geo.primaryTagStatic', data.primarytagstatic);

        if (data.tag_geos) //standalone
            for (var tag_geo of data.tag_geos)
                this.addTag(typeof App == 'undefined' ? new HaTag(tag_geo.tag) : App.haTags.byId[tag_geo.tag.tagid], true, false);

        if (data.tagids)
            for (var tagid of data.tagids)
                this.addTagById(tagid, true, false);
                //this.addTag(App.haTags.byId[tag_geo.tag.tagid], true, false);

        var images: Array<HAImage> = [];
        for (var i = 0; i < data.geo_images.length; i++) //geo_image
            images.push(new HAImage(data.geo_images[i].image, data.geo_images[i].ordering));

        images.sort((a, b) => a.ordering - b.ordering);
        this.set('geo.images', images);

        this.ignoreChanges = false;
    }
}

HaGeoService.register();