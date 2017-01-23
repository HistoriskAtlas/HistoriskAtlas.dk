class IconLayerNonClustered extends IconLayerBase {
    private source: ol.source.Vector; //TODO: Make non static?

    constructor() {
        this.source = new ol.source.Vector();

        super(this.source, (feature: Icon, resolution) => {
            return feature.getStyle();
        })
    }

    public addIcon(icon: Icon) {
        this.source.addFeature(icon);
    }

    public removeIcon(icon: Icon) {
        this.source.removeFeature(icon);
    }
}
