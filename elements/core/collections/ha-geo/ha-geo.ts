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

    ready() {
        this.$.ajax.url = Common.api + 'geo.json';
    }

    @observe("geo")
    geoChanged(newVal: number, oldVal: number) {
        this.initTags('geo'/*, this.geo.id*/);
        if (!this.geo.id)
            return;
        this.ignoreChanges = true;
        var schema = 'geoid,title,intro,primarytagstatic,freetags,yearstart,yearend,latitude,longitude,online,views,deleted,{user:[id,firstname,lastname,about,{user_institutions:[{institution:[id,tagid]}]}]},{geo_image:[empty,ordering,{image:[imageid,text,year,yearisapprox,photographer,licensee,userid,{tag_images:[' + (typeof App == 'undefined' ? Common.apiSchemaTags : '{collapse:id}') + ']}]}]}';
        if (this.geo.tags.length == 0) //&& typeof App == 'undefined'
            schema += ',{tag_geos:[' + Common.apiSchemaTags + ']}'; //TODO: only needed to get ids when in app mode.............................
            //schema += ',{tag_geos:[empty,{collapse:tagid}]}'
        this.set('params', {
            'v': 1,
            'sid': (<any>document).sid,
            'geoid': this.geo.id,
            'schema': '{geo:[' + schema + ']}'
        });
        this.$.ajax.generateRequest();
    }
    
    @observe("geo.title")
    titleChanged(newVal: string) {
        this.notifyPath('geo.link', this.geo.link);
        if (newVal && !this.ignoreChanges)
            Services.update('geo', { id: this.geo.id, title: this.geo.title }, () => {
            });
    }

    @observe("geo.intro")
    introChanged(newVal: string) {
        if (newVal && !this.ignoreChanges)
            Services.update('geo', { id: this.geo.id, intro: this.geo.intro }, () => {
                //App.toast.show('Introtekst gemt');
            });
    }

    @observe("geo.online")
    onlineChanged() {
        if (!this.ignoreChanges)
            Services.update('geo', { id: this.geo.id, online: this.geo.online }, () => {
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
                Services.insert('geo_image', { imageid: this.geo.images[indexSplice.index + i].id, geoid: this.geo.id, ordering: 0 });

            if (indexSplice.addedCount > 0) {
                var index = 0;
                for (var image of this.geo.images) {
                    if (image.ordering != index) {
                        image.ordering = index;
                        Services.update('geo_image', { geoid: this.geo.id, imageid: image.id, ordering: image.ordering });
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
        Services.update('geo', { primarytagid: this.geo.primaryTag ? this.geo.primaryTag.id : '\0', geoid: this.geo.id });
    }
    @observe("geo.primaryTagStatic")
    primaryTagStaticChanged() {
        if (this.ignoreChanges)
            return;

        Services.update('geo', { primarytagstatic: this.geo.primaryTagStatic, geoid: this.geo.id });
    }

    public handleResponse() {
        this.ignoreChanges = true;
        var data = this.$.ajax.lastResponse.data[0];
        
        if (typeof App == 'undefined')
            this.set('geo.shown', true);

        //TODO: check if already sat?
        this.set('geo.title', data.title);
        this.set('geo.intro', data.intro);
        this.set('geo.user', new HAUser(data.user));
        this.set('geo.primaryTagStatic', data.primarytagstatic);

        if (data.tag_geos)
            for (var tag_geo of data.tag_geos)
                this.addTag(typeof App == 'undefined' ? new HaTag(tag_geo.tag) : App.haTags.byId[tag_geo.tag.tagid], true, false);

                //this.addTagById(tagID, true, false);

        var images: Array<HAImage> = [];
        for (var i = 0; i < data.geo_image.length; i++)
            images.push(new HAImage(data.geo_image[i].image, data.geo_image[i].ordering)); //TODO: ordering?

        images.sort((a, b) => a.ordering - b.ordering);
        this.set('geo.images', images); //data.geo_images.length == 0 ? [113798] : [data.geo_images[0].id]

        this.ignoreChanges = false; //!this.editing;
    }

    //TODO: move to common element ("Tags"?)... inherit to ha-geo and (new) ha-image

    //private addTagFromAPI(tagID: number) {
    //    Services.get('tag', {
    //        schema: Common.apiSchemaTags,
    //        id: tagID
    //    }, (result) => {
    //        this.addTag(new HaTag(result.data[0]));
    //    });
    //}

    //public addTag(tag: HaTag) {
    //        this.addingTag = false;

    //    if (this.geo.tags2.indexOf(tag) == -1)
    //        this.push('geo.tags2', tag);
    //}

}

HaGeoService.register();