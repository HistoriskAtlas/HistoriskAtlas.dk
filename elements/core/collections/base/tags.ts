class Tags extends polymer.Base {

    @property({ type: Array, notify: true })
    public subjects: Array<HaTag>;

    @property({ type: Array, notify: true })
    public periods: Array<HaTag>;

    @property({ type: Array, notify: true })
    public institutions: Array<HaTag>;

    @property({ type: Array, notify: true })
    public destinations: Array<HaTag>;

    @property({ type: Object, notify: true })
    public licens: HaLicens;

    //public tagsById: Array<HaTag> = [];

    private static categoryNames: Array<string> = [, , , 'institutions', , , , , 'destinations', 'subjects', 'periods'];
    private tagRelationName: string;
    //private tagRelationId: number;
    private subProperty: string;

    protected initTags(tagRelationName: string, /*tagRelationId: number, */subProperty?: string) {
        this.tagRelationName = tagRelationName;
        //this.tagRelationId = tagRelationId;
        this.subProperty = subProperty;
        for (var categoryName of Tags.categoryNames)
            if (categoryName)
                this.set(categoryName, [])
        this.licens = null;
        for (var tag of <Array<HaTag>>this[this.tagRelationName].tags)
            this.addTag(tag, false, false);
    }

    public addTagById(tagId: number, addToBaseArray: boolean, save: boolean) {
        if (typeof App == 'undefined') {
        //    Services.get('tag', {
        //        schema: Common.apiSchemaTags,
        //        id: tagId
        //    }, (result) => {
        //        this.addTag(new HaTag(result.data[0]), addToBaseArray, save);
            //    })
            Services.HAAPI_GET(`tag/${tagId}`, null, (result) => {
                this.addTag(new HaTag(result.data), addToBaseArray, save);
            });
        } else
            this.addTag(App.haTags.byId[tagId], addToBaseArray, save);
    }
    public addTag(tag: HaTag, addToBaseArray: boolean, save: boolean): boolean {
        if (addToBaseArray)
            if (this[this.tagRelationName].tags.indexOf(tag) > -1)
                return false;

        if (tag.category == 4) { //Licens
            if (this.licens && save)
                this.removeTagById(this.licens.tagID)
            this.set('licens', (<HaLicenses>document.querySelector('ha-licenses')).byTagID[tag.id]);
        }

        if (addToBaseArray)
            this.push(this.tagRelationName + '.tags', tag);

        if (Tags.categoryNames[tag.category])
            this.push(Tags.categoryNames[tag.category], tag);

        if (save)
            Services.HAAPI_POST(`tag${this.propertyName()}`, {}, Common.formData(JSON.parse('{ "tagid": ' + tag.id + ', "' + this.propertyName() + 'id": ' + this.propertyId() + ' }'))); //this.tagRelationId

        return true;
    }

    public removeTagById(tagId) {
        for (var tag of <Array<HaTag>>this[this.tagRelationName].tags)
            if (tag.id == tagId) {
                this.removeTag(tag);
                return;
            }
    }
    public removeTag(tag: HaTag) {
        this.splice(this.tagRelationName + '.tags', this[this.tagRelationName].tags.indexOf(tag), 1);
        if (Tags.categoryNames[tag.category])
            this.splice(Tags.categoryNames[tag.category], this[Tags.categoryNames[tag.category]].indexOf(tag), 1);

        Services.HAAPI_DELETE(`tag${this.propertyName()}`, null, true, JSON.parse('{ "tagid": ' + tag.id + ', "' + this.propertyName() + 'id": ' + this.propertyId() + ' }')); //this.tagRelationId
    }

    private propertyName(): string {
        return this.subProperty ? this.subProperty : this.tagRelationName
    }

    private propertyId(): number {
        return (this.subProperty ? this[this.tagRelationName][this.subProperty] : this[this.tagRelationName]).id;
    }
}