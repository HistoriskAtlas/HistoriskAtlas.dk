var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IconLayerBase = (function (_super) {
    __extends(IconLayerBase, _super);
    function IconLayerBase(source, style) {
        //this.source = source;
        _super.call(this, {
            source: source,
            style: style,
            updateWhileAnimating: false,
            updateWhileInteracting: true,
            renderBuffer: 48,
            renderOrder: function (feauture1, feauture2) {
                var coord1 = feauture1.getGeometry().getCoordinates();
                var coord2 = feauture2.getGeometry().getCoordinates();
                return coord2[1] - coord1[1];
            }
        });
    }
    IconLayerBase.prototype.moveEvent = function (event) {
        this.oldDragCoordinate = null;
    };
    IconLayerBase.prototype.dragEvent = function (event, geo) {
        if (!App.haUsers.user.canEdit(geo))
            return;
        if (!this.oldDragCoordinate) {
            this.oldDragCoordinate = event.coordinate;
            return;
        }
        //if (this.dragDirtyGeo && this.dragDirtyGeo != geo) //TODO: alert?
        //    return;
        //this.dragDirtyGeo = geo;
        var deltaX = event.coordinate[0] - this.oldDragCoordinate[0];
        var deltaY = event.coordinate[1] - this.oldDragCoordinate[1];
        geo.translateCoord(deltaX, deltaY);
        this.oldDragCoordinate = event.coordinate;
        //var pixel = App.map.getPixelFromCoordinate(geo.coord3857);
        //App.mapYesNo.left = pixel[0];
        //App.mapYesNo.top = pixel[1];
        App.map.preventDrag(event);
    };
    return IconLayerBase;
}(ol.layer.Vector));
//# sourceMappingURL=IconLayerBase.js.map