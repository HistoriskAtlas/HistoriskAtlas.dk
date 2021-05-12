@component("ha-contents")
class HaContents extends polymer.Base implements polymer.Element {
    @property({ type: Object })
    public geo: Object & HaGeo;

    @property({ type: Array, notify: true })
    public contents: Array<HaContent>;

    @property({ type: Object, notify: true })
    public editorialContent: HaContent;

    @property({ type: Object })
    public params: Object;

    //ready() {
    //    this.$.ajax.url = Common.api + 'content.json';
    //}

    @observe("geo")
    geoChanged(newVal: number, oldVal: number) {
        if (!this.geo.id)
            return;
        //this.set('params', {
        //    'geoid': this.geo.id, 
        //    'count': 'all',//TODO: exclude content types based on if editing........
        //    'schema': ContentViewer.contentSchema
        //});
        //this.$.ajax.generateRequest();
        Services.getHAAPI('contents', {
            geoid: this.geo.id
        }, (result) => this.handleResponse(result.data))
    }

    public handleResponse(datas: Array<any>) {
        var newContents: Array<HaContent> = [];
        //var newContent: HaContent;
        //this.$.ajax.lastResponse.forEach(data => {
        for (var data of datas)
            newContents.push(new HaContent(data));
        //});
        this.contents = newContents;
    }

    @observe("contents.*")
    contentsChanged(changeRecord: any) {
        var props: Array<string> = (<string>changeRecord.path).split('.');
        var property: string = props.pop();
        if (props.length == 0) { //array it self was changed
            this.selectSubContents();
            return;
        }
        if (props.length == 1) //splice or property of array changed
        {
            if (property == 'splices') { //TODO: Check for deleted keys?
                this.selectSubContents();

                var splice = changeRecord.value.indexSplices[0];

                //TODO: Multiple adds??
                if (splice.addedCount > 0)
                    (<HaContent>splice.object[splice.index]).insert();

                for (var content of splice.removed)
                    (<HaContent>content).delete();
            }
            return;
        }

        //var content: HaContent = this.contents[props[1].substring(1)];
        //if (props.length == 2)
        //    content.update(property);

        //if (props.length == 3 && property == 'splices') { //SubContent inserted...
        //    var splice = changeRecord.value.indexSplices[0];

        //    //TODO: Multiple adds??
        //    if (splice.addedCount > 0)
        //        (splice.object[splice.index]).insert((propsReturned: Array<string>) => {
        //            for (var propReturned of propsReturned) {
        //                //var test = props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned;
        //                //var value = splice.object[splice.index][propReturned];
        //                this.notifyPath(props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned, splice.object[splice.index][propReturned]);
        //                //this.set(props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned, propsReturned[propReturned]);
        //            }
        //        }); //TODO: notify changes in callback when new values are returned (created, id and user)

        //    for (var subcontent of splice.removed)
        //        subcontent.delete();
        //}

        //if (props.length == 4)
        //    content[props[2]][props[3].substring(1)].update(property);
    }

    private selectSubContents() {
        this.$.selectorEditorialContent.select(this.contents.filter((content) => content.isEditorial).pop());
    }

}

HaContents.register();