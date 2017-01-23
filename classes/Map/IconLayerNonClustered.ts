class IconLayerNonClustered extends IconLayerBase {
    private source: ol.source.Vector; //TODO: Make non static?

    constructor() {
        var source = new ol.source.Vector();

        super(source, (feature: Icon, resolution) => {
            return feature.getStyle();
        })

        this.source = source;
    }

    public addIcon(icon: Icon) {
        this.source.addFeature(icon);
    }

    public removeIcon(icon: Icon) {
        this.source.removeFeature(icon);
    }
}
