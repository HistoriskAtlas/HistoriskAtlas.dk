@component("collection-geo-list-item")
class CollectionGeoListItem extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public collectionGeo: HaCollectionGeo;

    @property({ type: Boolean, value: false })
    public closeable: boolean;

    @property({ type: Boolean })
    public dragable: boolean;

    closeTap(e: any) {
        this.fire('close', this.collectionGeo);
    }

    //geoTap(e: any) {
    //    var geo = <HaGeo>e.model.geo;
    //    Common.dom.append(WindowGeo.create(geo));
    //    App.map.centerAnim(geo.coord, 1000, true)
    //}
    hideArrow(closeable: boolean, showText: boolean): boolean {
        return closeable ? false : !showText;
    }

    arrowTap(e: Event) {
        e.cancelBubble = true;
    }

    headline(title: string, showText: boolean, uiOpen: boolean): string {
        if (title)
            return title;

        if (uiOpen)
            return '';

        if (showText && this.collectionGeo.content)
            return $('<span>' + this.collectionGeo.content.texts[0].text + '</span>').text();

        return '';
    }
}

CollectionGeoListItem.register();