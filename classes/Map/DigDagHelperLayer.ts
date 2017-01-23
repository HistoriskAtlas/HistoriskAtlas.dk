class DigDagHelperLayer extends ol.layer.Tile {
    private source: ol.source.XYZ;
    private _type: string;
    private _year: number;
    private _active: boolean;
    private _dirty: boolean;

    private regionID: number
    //private imageData: ImageData;
    private data32: Uint32Array;
    private data32PrevYear: Uint32Array;
    private yearChangedTimeout: number;
    private loading: number;
    private loaded: number;
    private oldLoaded: number;
    private redrawCount: number;

    public context: CanvasRenderingContext2D;

    constructor(type: string, year: number) {
        var source = new ol.source.XYZ({ url: DigDagLayer.getUrl(type, year), crossOrigin: 'Anonymous' });
        super({ source: source });
        this._type = type;
        this._year = year;
        this._active = false;
        this._dirty = true;
        this.loaded = 0;
        this.loading = 0;
        this.source = source;
        this.setVisible(false);

        this.context = document.createElement('canvas').getContext('2d');

        (<any>this).source.on('tileloadstart', () => this.loading++);
        (<any>this).source.on('tileloadend', () => this.loaded++);
        (<any>this).source.on('tileloaderror', () => this.loaded++);
        
        this.on('postcompose', (event: any) => {

            if (this.loaded != this.oldLoaded || this.redrawCount == 0) {
                this.context.canvas.width = event.context.canvas.width;
                this.context.canvas.height = event.context.canvas.height;

                var imageData = event.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height); //TODO: Create instead?
                this.data32 = new Uint32Array(imageData.data.buffer);

                this.generateContext();
                //console.debug('redraw');
            }

            //console.debug('loaded: ' + this.loaded + ' | loading: ' + this.loading + ' | redrawCount: ' + this.redrawCount);

            if (this.loaded == this.loading && this.redrawCount > 2)
                this.setVisible(false);
            else
                this.redrawCount++;
            
            this.oldLoaded = this.loaded;
        });
    }

    get active(): boolean {
        return this._active || !!this.data32PrevYear;
    }

    setDirty() {
        this._dirty = true;
        this._active = false;
        if (this.data32PrevYear) {
            clearTimeout(this.yearChangedTimeout);
            this.data32PrevYear = null;
            App.map.digDagLayer.setOpacity(1);
        }
        this.setVisible(false);
    }

    set year(newYear: number) {
        if (newYear == this._year)
            return;

        this._year = newYear;
        this.setDirty();
        this.data32PrevYear = this.data32; //TODO: This only works if the helper layer is currently active.... need to redraw first if not....
        this.source.setUrl(this.url);
        App.map.digDagLayer.setOpacity(0);
        this.update(null);
        this.yearChangedTimeout = setTimeout(() => { //TODO: only if not changing?
            this.data32PrevYear = null;
            this._active = false;
            App.map.digDagLayer.setOpacity(1);
            this.update(null);
        }, 10000); //Was 3000
    }

    set type(newType: string) {
        if (newType == this._type)
            return;
        this._type = newType;
        this.setDirty();
        this.source.setUrl(this.url);
    }

    private get url(): string {
        return DigDagLayer.getUrl(this._type, this._year);
    }

    public update(id: number) {
        if (App.map.moving)
            return;

        if (this.regionID == id && this._active)
            return;

        if (id == 0) {
            this._active = false;
            this.regionID = 0;
            App.map.render(); //Needed?
            return;
        }

        if (id == 1)
            return;

        if (id)
            this.regionID = id;

        this._active = true;

        if (this._dirty) {
            this.redrawCount = 0;
            this.setVisible(true);
            App.map.render(); //TODO: needed?
            this._dirty = false;
        } else {
            this.generateContext();
        }
    }

    //private generateContext() {

    //    //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    //    //var staticImageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
    //    var staticImageData = this.context.createImageData(this.context.canvas.width, this.context.canvas.height) //Better performance? mem use problem?
    //    var shadowOffset = staticImageData.width * 16 + 16;

    //    for (var i: number = 0; i < staticImageData.data.length; i += 4) {
    //        if (this.imageData.data[i] + (this.imageData.data[i + 1] << 8) + (this.imageData.data[i + 2] << 16) == this.regionID) {
    //            var j = i + shadowOffset;

    //            //staticImageData.data[j] = 0;
    //            //staticImageData.data[j + 1] = 0;
    //            //staticImageData.data[j + 2] = 0;
    //            staticImageData.data[j + 3] = 100;

    //            staticImageData.data[i] = 255;
    //            staticImageData.data[i + 1] = 255;
    //            staticImageData.data[i + 2] = 255;
    //            staticImageData.data[i + 3] = 180;
    //        }
    //    }
    //    this.context.putImageData(staticImageData, 0, 0);
    //    App.map.render();
    //}

    private generateContext() {
        //this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        //var staticImageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
        var staticImageData = this.context.createImageData(this.context.canvas.width, this.context.canvas.height) //Better performance? mem use problem?
        var shadowOffset = staticImageData.width * 4 + 4;

        var bufStatic = new ArrayBuffer(staticImageData.data.length);
        var bufStatic8 = new Uint8ClampedArray(bufStatic);
        var dataStatic32 = new Uint32Array(bufStatic);
        
        var white: number = 255 | (255 << 8) | (255 << 16) | (180 << 24);
        var red0: number = 255 | (127 << 24);
        var red1: number = 255 | (255 << 24);
        //var green: number = (200 << 8) | (255 << 24);
        var shadow: number = 100 << 24;
        var black0: number = 40 << 24
        var black1: number = 120 << 24
        var black0unmasked: number = (0 | (255 << 24)) >>> 0;
        var black1unmasked: number = (1 | (255 << 24)) >>> 0;
        //var mask = 255 | (255 << 8) | (255 << 16);

        var regionIDunmasked = this.regionID == 0 ? 42 : (this.regionID | (255 << 24)) >>> 0;

        for (var i: number = 0; i < dataStatic32.length; i++) {
            if (this.data32PrevYear) {
                if (this.data32[i]) {
                    if (this.data32PrevYear[i] > black1unmasked) {
                        if (this.data32[i] == black0unmasked) {
                            dataStatic32[i] = red0;
                            continue;
                        }
                        if (this.data32[i] == black1unmasked) {
                            dataStatic32[i] = red1;
                            continue;
                        }
                    }
                }

                if (this.data32PrevYear[i] == black0unmasked) {
                    dataStatic32[i] = black0;
                    continue;
                }
                if (this.data32PrevYear[i] == black1unmasked) {
                    dataStatic32[i] = black1;
                    continue;
                }
            }
            
            if (this.data32[i] == regionIDunmasked) {
                dataStatic32[i + shadowOffset] = shadow;
                dataStatic32[i] = white;
                continue;
            }
        }

        (<any>staticImageData).data.set(bufStatic8);
        this.context.putImageData(staticImageData, 0, 0);
        App.map.render();
    }

}