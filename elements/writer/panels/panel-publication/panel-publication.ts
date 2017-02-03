@component("panel-publication")
class PanelPublication extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public destinations: Array<HaTag>;

    @property({ type: Object })
    public tagsService: Tags;

    addTap() {
        var existingTagIds: Array<number> = [];
        for (var destination of this.destinations)
            existingTagIds.push(destination.id);
        Services.get('tag', { schema: JSON.stringify({ tag: { fields: [{ collapse: 'id' }], filters: [{ parents: [{ id: App.haUsers.user.currentInstitution.tagid }] }] } }), categori: 8, count: 'all' }, (result) => {
            var tags: Array<HaTag> = [];
            for (var tagid of result.data)
                if (existingTagIds.indexOf(tagid) == -1)
                    tags.push(App.haTags.byId[tagid]);
            Common.dom.append(DialogTagSelection.create('Tilføj publiceringsdestionation', tags, (tag) => {
                this.tagsService.addTag(tag, true, true);
            }));
        })
    }

    @listen('close')
    removeTag(e: any) {
        this.tagsService.removeTag(<HaTag>e.detail);        
    }
}

PanelPublication.register();