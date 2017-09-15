@component("collection-geo-list-item")
class CollectionGeoListItem extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public collectionGeo: HaCollectionGeo;

    @property({ type: Boolean, value: false })
    public closeable: boolean;

    @property({ type: Boolean })
    public dragable: boolean;

    @property({ type: Number, value: 0 })
    public domChangeCounter: number;

    closeTap(e: any) {
        this.fire('close', this.collectionGeo);
    }

    @observe('collectionGeo.content.subContents.0.text') 
    textChanged()
    {
        this.set('domChangeCounter', this.domChangeCounter + 1);
    }
    //geoTap(e: any) {
    //    var geo = <HaGeo>e.model.geo;
    //    Common.dom.append(WindowGeo.create(geo));
    //    App.map.centerAnim(geo.coord, 1000, true)
    //}
    hideArrow(closeable: boolean, showText: boolean, uiOpen: boolean): boolean {
        //return closeable ? false : !showText;

        if (uiOpen || closeable)
            return false;

        return $(this.$.headline).outerWidth() >= this.$.headline.scrollWidth;
    }

    arrowTap(e: Event) {
        e.cancelBubble = true;
    }

    headline(title: string, showText: boolean, uiOpen: boolean): string {
        if (title)
            return title;

        if (uiOpen)
            return '';

        if (showText && this.collectionGeo.content) {
            return $('<span>' + (<HaSubContentText>this.collectionGeo.content.subContents[0]).text.replace('<br>', ' - ') + '</span>').text();
        }

        return '';
    }
}

CollectionGeoListItem.register();