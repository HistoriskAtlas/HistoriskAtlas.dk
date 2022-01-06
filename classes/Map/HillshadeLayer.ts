class Hillshade extends ol.layer.Tile {

    constructor(mainMap: MainMap) {
        super({
            source: new ol.source.XYZ({
                //url: location.protocol + '//tile.historiskatlas.dk/tile/hillshade/' + Common.apiKey + '/{z}/{x}/{y}.png',
                //url: `https://haapi.historiskatlas.dk/cache/tile_hillshade/{z}/{x}/{y}.png?key=${Common.apiKey}`,
                url: `https://omnimaps-apim.azure-api.net/144/{z}/{x}/{y}.webp?key=${Common.omniMapsKey}`,
                crossOrigin: 'Anonymous'
            })
        });

        this.setVisible(false); //TOOD: Remove layer instead?
        mainMap.addLayer(this);

        //this.on('precompose', (event: any) => {
        //    event.context.globalCompositeOperation = 'overlay';
        //});

        //this.on('postcompose', (event: any) => {
        //    event.context.globalCompositeOperation = 'source-over';
        //});
    }

    public update(opacity: number) {
        if (opacity == 0) {
            this.setVisible(false); //TOOD: Remove layer instead?
            return;
        }

        if (!this.isVisible)
            this.setVisible(true);
                
        this.setOpacity(opacity);
    }

    public get isVisible(): boolean {
        return this.getVisible();
    }
}


