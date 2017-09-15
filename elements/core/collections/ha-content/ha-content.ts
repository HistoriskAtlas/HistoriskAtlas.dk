@component("ha-content")
class HaContentService extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public content: HaContent;

    @observe("content.*")
    contentChanged(changeRecord: any) {
        var props: Array<string> = (<string>changeRecord.path).split('.');
        var property: string = props.pop();

        if (props.length == 1) {
            //if (property == 'headline')
            //    this.set('content.texts.0.headline', changeRecord.value)
            //else
                this.content.update(property);
        }

        if (props.length == 2 && property == 'splices') { //SubContent inserted...
            var splice = changeRecord.value.indexSplices[0];

            //TODO: Multiple adds??
            if (splice.addedCount > 0)
                (splice.object[splice.index]).insert((propsReturned: Array<string>) => {
                    for (var propReturned of propsReturned) {
                        //var test = props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned;
                        //var value = splice.object[splice.index][propReturned];
                        //this.notifyPath(props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned, splice.object[splice.index][propReturned]);
                        this.notifyPath(props[0] + '.' + props[1] + '.' + splice.index + '.' + propReturned, splice.object[splice.index][propReturned]);
                        //this.set(props[0] + '.' + props[1].substring(1) + '.' + props[2] + '.' + splice.index + '.' + propReturned, propsReturned[propReturned]);
                    }
                }); //TODO: notify changes in callback when new values are returned (created, id and user)

            for (var subcontent of splice.removed)
                subcontent.delete();

            //this.notifyPath('content.count', this.content.count);
        }

        if (props.length == 3)
            this.get(props.join('.')).update(property);
            //this.content[props[1]][props[2].substring(1)].update(property);
    }

}

HaContentService.register();