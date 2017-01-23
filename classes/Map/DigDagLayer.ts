class DigDagLayer extends ol.layer.Tile {
    public static instanceDigDagLayer: DigDagLayer;
    private static tileSize: number = 256;
    public static borderRegion: HaRegion;

    //private mainMap: MainMap;
    //private curRegionID: number;
    private quadTree: any;
    private tileCoord: number[];
    private data: number[];//Uint8Array; <- could be optimized! Supported on IE11+ and all other browsers
    private source: ol.source.XYZ;
    private _type: string;
    private _year: number;

    private helper: DigDagHelperLayer;

    constructor(type: string, year: number) {
        var source = new ol.source.XYZ({ url: DigDagLayer.getUrl(type, year), crossOrigin: 'Anonymous' });
        (<any>source).setCanvasTileClass();

        super({ source: source });

        this.source = source;
        this._type = type;
        this._year = year;
        //this.mainMap = mainMap;

        if (!DigDagLayer.borderRegion)
            DigDagLayer.borderRegion = new HaRegion();
        this.quadTree = 0;

        DigDagLayer.instanceDigDagLayer = this;


        this.on('postcompose', (event: any) => {
            if (this.helper.active)
                event.context.drawImage(this.helper.context.canvas, 0, 0);
        });

        //TODO: only if not touch!!
        this.helper = new DigDagHelperLayer(type, year);
        App.map.getLayers().insertAt(0, this.helper);
    }

    set year(newYear: number) {
        if (newYear == this._year)
            return;
        this._year = newYear;
        this.quadTree = 0;
        this.source.setUrl(this.url);   

        this.helper.year = newYear;    
    }

    set type(newType: string) {
        if (newType == this._type)
            return;
        this._type = newType;
        this.quadTree = 0;
        this.source.setUrl(this.url);

        this.helper.type = newType;
    }

    private get url(): string {
        return DigDagLayer.getUrl(this._type, this._year);
    }

    public static getUrl(type: string, year: number) {
        return 'http://tile.historiskatlas.dk/digdag/' + type + '/' + year + '/{z}/{x}/{y}.png';
    }

    public show(type: string) {
        this.type = type;
        this.setVisible(true);
        this.helper.setVisible(true);
    }

    public hide() {
        this.helper.setVisible(false);
        this.setVisible(false); //TODO: also hide helper layer?
        this.quadTree = 0;
        this._type = null;
        this.helper.update(0);
    }

    public get isVisible(): boolean {
        return this.getVisible();
    }

    public change() {
        if (this._type)
            this.helper.setDirty();
    }

    public getRegion(coord: ol.Coordinate): HaRegion {
        if (coord == null)
            return null;

        var regionID = this.getRegionID(this.quadTree, [coord[0], -coord[1]], -20037508.34, 20037508.34, -20037508.34, 20037508.34);

        if (regionID == 0) {
            this.helper.update(0);
            return null;
        }

        if (regionID == 1) {
            this.helper.update(1);
            return DigDagLayer.borderRegion;
        }

        this.helper.update(regionID);
        return App.haRegions.regions[regionID];
    }

    private getRegionID(qt: any, coord: number[], minX: number, maxX: number, minY: number, maxY: number) {
        if (typeof (qt) == 'number')
            return qt == 16777215 ? 0 : qt;

        var xs = coord[0] < (maxX + minX) / 2 ? 0 : 1;
        var ys = coord[1] < (maxY + minY) / 2 ? 0 : 1;
        var i = xs + (ys << 1);

        if (xs == 0)
            maxX -= (maxX - minX) / 2;
        else
            minX += (maxX - minX) / 2;

        if (ys == 0)
            maxY -= (maxY - minY) / 2;
        else
            minY += (maxY - minY) / 2;

        return this.getRegionID(qt[i], coord, minX, maxX, minY, maxY);
    }
    

    //TODO: rename to modifyImage.... export when compiling openlayers...

    public static modifyImage(image: any, tileCoord: number[]) {
    //public static Lo(image: any, tileCoord: number[]) {
        //TODO:For now, only one digdaglayer is supported:
        return this.instanceDigDagLayer.modifyImage(image, tileCoord);
    }

    private modifyImage(image: any, tileCoord: number[]): any {
        this.tileCoord = tileCoord

        var canvas = document.createElement('canvas');
        canvas.width = DigDagLayer.tileSize;
        canvas.height = DigDagLayer.tileSize;
        var context = canvas.getContext('2d');
        //var context = ol.dom.createCanvasContext2D(tileSize, tileSize);

        context.drawImage(image, 0, 0);

        var imageData: ImageData = context.getImageData(0, 0, DigDagLayer.tileSize, DigDagLayer.tileSize);
        this.data = <any>imageData.data;
        
        //if (this.tileCoord[0] < 9)
        this.quadTree = this.createQuadTree(this.quadTree, 0);
        
        context.putImageData(imageData, 0, 0);
        this.data = null;

        return context.canvas;

        //TODO: Better performance? No need to create a new canvas each time...?
        //image.src = canvas.toDataURL("image/png");
        //return image;
    }

    private createQuadTree(qt, z) {
        var xs = (1 << (this.tileCoord[0] - z - 1) & this.tileCoord[1]) ? 1 : 0
        var ys = (1 << (this.tileCoord[0] - z - 1) & (-this.tileCoord[2] - 1)) ? 1 : 0
        var i = xs + (ys << 1);
        var nqt;

        if (z < this.tileCoord[0]) //above cur tile z
        {
            nqt = typeof (qt) == 'number' ? [qt, qt, qt, qt] : [qt[0], qt[1], qt[2], qt[3]];
            nqt[i] = this.createQuadTree(nqt[i], z + 1);
            //nqt = this.cleanQuad(nqt);
        } else
            nqt = this.getQuadTree(qt, 0, 0, 0);

        return nqt;
    }

    private getQuadTree(qt, z, x, y) {
        var nqt;
        if (z < 8) {
            var nx = x << 1;
            var ny = y << 1;
            var nz = z + 1;
            if (typeof (qt) == 'number') {
                nqt = [this.getQuadTree(qt, nz, nx, ny),
                    this.getQuadTree(qt, nz, nx + 1, ny),
                    this.getQuadTree(qt, nz, nx, ny + 1),
                    this.getQuadTree(qt, nz, nx + 1, ny + 1)]
            } else {
                    nqt = [this.getQuadTree(qt[0], nz, nx, ny),
                        this.getQuadTree(qt[1], nz, nx + 1, ny),
                        this.getQuadTree(qt[2], nz, nx, ny + 1),
                        this.getQuadTree(qt[3], nz, nx + 1, ny + 1)]
            }

            nqt = this.cleanQuad(nqt);
        } else {
            var i = (x + (y << 8)) << 2;
            var data = this.data;

            //TODO: What is going on here?!

            nqt = data[i] + (data[i + 1] << 8) + (data[i + 2] << 16);  //RGBA
            //nqt = data[i + 2] + (data[i + 1] << 8) + (data[i] << 16);  //BGRA

            //Modify:
            if (nqt) {
                if (nqt == 1) {
                    data[i + 3] = 120; //Was 120
                    return 1;
                }
                data[i + 3] = 0;
            } else {
                data[i + 3] = 40; //WAS 40
                return 1;
            }
        }

        return nqt;
    }

    private cleanQuad(qt) {
        if (qt[0] == qt[1])
            if (qt[1] == qt[2])
                if (qt[2] == qt[3])
                    return qt[0];

        return qt;
    }
}


