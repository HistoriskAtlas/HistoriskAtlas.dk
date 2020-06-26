class FlexiblePolyline {

    //Converted from here: https://github.com/heremaps/flexible-polyline/blob/master/javascript/index.js

    //private static readonly DEFAULT_PRECISION = 5;

    private static readonly DECODING_TABLE = [
        62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
    ];

    //private static readonly FORMAT_VERSION = 1;

    //private static readonly ABSENT = 0;
    //private static readonly LEVEL = 1;
    //private static readonly ALTITUDE = 2;
    //private static readonly ELEVATION = 3;
    //// Reserved values 4 and 5 should not be selectable
    //private static readonly CUSTOM1 = 6;
    //private static readonly CUSTOM2 = 7;

    private static readonly Num = Number;//typeof (<any>window).BigInt !== "undefined" ? (<any>window).BigInt : Number;

    //public static get apiKey(): string {
    //    return App.isDev() ? "ZGV2ZWxvcG" : "aGlzdG9yaX";
    //}

    public static decode(encoded: string): [number, number][] {
        const decoder = this.decodeUnsignedValues(encoded);
        const header = this.decodeHeader(decoder[0], decoder[1]);

        const factorDegree = 10 ** header.precision;
        //const factorZ = 10 ** header.thirdDimPrecision;
        //const { thirdDim } = header;

        let lastLat = 0;
        let lastLng = 0;
        //let lastZ = 0;
        const res: [number, number][] = [];

        let i = 2;
        for (; i < decoder.length;) {
            const deltaLat = this.toSigned(decoder[i]) / factorDegree;
            const deltaLng = this.toSigned(decoder[i + 1]) / factorDegree;
            lastLat += deltaLat;
            lastLng += deltaLng;

            //if (thirdDim) {
            //    const deltaZ = toSigned(decoder[i + 2]) / factorZ;
            //    lastZ += deltaZ;
            //    res.push([lastLat, lastLng, lastZ]);
            //    i += 3;
            //} else {
                res.push((<any>ol.proj.transform)([lastLng, lastLat], 'EPSG:4326', 'EPSG:3857'));
                i += 2;
            //}
        }

        //if (i !== decoder.length) {
        //    throw new Error('Invalid encoding. Premature ending reached');
        //}

        return res;
        //return {
        //    ...header,
        //    polyline: res,
        //};
    }

    private static decodeChar(char: string) {
        const charCode = char.charCodeAt(0);
        return this.DECODING_TABLE[charCode - 45];
    }

    private static decodeUnsignedValues(encoded: string) {
        let result = this.Num(0);
        let shift = this.Num(0);
        const resList = [];

        encoded.split('').forEach((char) => {
            const value = this.Num(this.decodeChar(char));
            result |= (value & this.Num(0x1F)) << shift;
            if ((value & this.Num(0x20)) === this.Num(0)) {
                resList.push(result);
                result = this.Num(0);
                shift = this.Num(0);
            } else {
                shift += this.Num(5);
            }
        });

        if (shift > 0) {
            throw new Error('Invalid encoding');
        }

        return resList;
    }

    private static decodeHeader(version, encodedHeader) {
        //if (+version.toString() !== this.FORMAT_VERSION) {
        //    throw new Error('Invalid format version');
        //}
        const headerNumber = +encodedHeader.toString();
        const precision = headerNumber & 15;
        const thirdDim = (headerNumber >> 4) & 7;
        const thirdDimPrecision = (headerNumber >> 7) & 15;
        return { precision, thirdDim, thirdDimPrecision };
    }

    private static toSigned(val) {
        // Decode the sign from an unsigned value
        let res = val;
        if (res & this.Num(1)) {
            res = ~res;
        }
        res >>= this.Num(1);
        return +res.toString();
    }

}