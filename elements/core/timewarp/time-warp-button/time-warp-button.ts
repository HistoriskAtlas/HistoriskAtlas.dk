@component("time-warp-button")
class TimeWarpButton extends polymer.Base implements polymer.Element {

    @property({ type: Number })
    public mode: TimeWarpModes & number;

    @property({ type: Number })
    public radian: number;

    @property({ type: Boolean })
    public lift: boolean;

    @property({ type: String })
    public icon: string;

    private static radian: number = Math.PI * (7 / 4);
    private static transitionMorph: string = 'right .4s cubic-bezier(0.42,0,0.42,1), top .4s cubic-bezier(0.42,0,0.42,1), bottom .4s cubic-bezier(0.42,0,0.42,1), height 0.3s, max-width ease-in-out 0.3s';
    private static transitionBeforeMove: string = 'opacity 1s ease 1s, height 0.3s';
    private static transitionAfterMove: string = 'opacity 0.5s ease, height 0.3s';
    private static _allTimeWarpButtons: Array<Object>;
    private lastMode: TimeWarpModes;
    private lastDragMode: TimeWarpDragModes;

    constructor() {
        super();
        //this.update();
        //this.show();
        $(this.domHost).css('opacity', 0);
    }

    buttonTap(e) {
        e.preventDefault();
        this.fire('buttonOnlyTap');
    }

    hasIcon(icon: String): boolean {
        return !!icon;
    }

    public show() {
        $(this.domHost).css('transition', TimeWarpButton.transitionAfterMove)
        $(this.domHost).css('opacity', 1);
    }

    public hide() {
        $(this.domHost).css('opacity', 0);
    }

    public update() {
        var dom = $(this.domHost);
        this.mode = App.map.timeWarp.mode;

        if (App.map.timeWarp.dragMode != this.lastDragMode) {
            dom.css('transition', App.map.timeWarp.dragMode == TimeWarpDragModes.NONE ? TimeWarpButton.transitionAfterMove : TimeWarpButton.transitionBeforeMove)
            dom.css('opacity', App.map.timeWarp.dragMode == TimeWarpDragModes.NONE ? '1.0' : '0.0')
            this.lastDragMode = App.map.timeWarp.dragMode;
        }

        if (this.mode == TimeWarpModes.MORPH) {
            if (this.lastMode == TimeWarpModes.SPLIT) {
                dom.css('transition', TimeWarpButton.transitionMorph);
                dom.css('max-width', App.map.timeWarp.radius * 2);
            }
            if (this.lastMode == TimeWarpModes.CIRCLE) {
                dom.css('transition', TimeWarpButton.transitionMorph);
                dom.css('right', this.maxX);
                if (this.isMapButton)
                    dom.css('bottom', 15);
                else
                    dom.css('top', this.radian ? this.minY : this.maxYCalc);
                dom.css('max-width', 'calc(50vw - 85px)');
            }
        }
        if (this.mode == TimeWarpModes.CIRCLE || (this.mode == TimeWarpModes.MORPH && this.lastMode == TimeWarpModes.SPLIT)) {
            var maxWidth = App.map.timeWarp.radius * 2;
            var targetWidth = Math.min(maxWidth, dom.width());
            var x = this.radian ? Common.dom.width() - (App.map.timeWarp.position[0] + 20 + Math.cos(TimeWarpButton.radian + this.radian / App.map.timeWarp.radius) * App.map.timeWarp.radius) : Common.dom.width() - (App.map.timeWarp.position[0] + targetWidth / 2);
            var y = this.radian ? App.map.timeWarp.position[1] - 20 + Math.sin(TimeWarpButton.radian + this.radian / App.map.timeWarp.radius) * App.map.timeWarp.radius : App.map.timeWarp.position[1] + App.map.timeWarp.radius - 20;
            //dom.css('right', Math.max(x, this.maxX));
            //dom.css('top', this.radian ? Math.max(y, this.minY) : (y > this.maxY ? this.maxYCalc : y));
            dom.css('right', x);
            if (this.isMapButton)
                dom.css('bottom', App.map.dom.height() - y - 31);
            else
                dom.css('top', y);
            dom.css('max-width', maxWidth);
        }

        this.lastMode = this.mode;
    }

    private get isMapButton(): boolean {
        return (<any>this.domHost).tagName == 'TIME-WARP-MAP-BUTTON';
    }

    private get maxX(): number {
        return this.radian ? 10 : 60;
    }
    private get minY(): number {
        //return 10 + (this.radian > 0 ? 45 : 0);
        return 10 + (this.radian + 44);
    }
    private get maxY(): number {
        return App.map.getSize()[1] - 46 - (this.lift ? 100 : 0);
    }
    private get maxYCalc(): string {
        return 'calc(100% - ' + (46 + (this.lift ? 100 : 0)) + 'px)';
    }

    public static updateTimeWarpUI() {
        if (!this.allTimeWarpButtons)
            return;

        for (var button of this.allTimeWarpButtons)
            (<any>button).update();
    }

    public static showTimeWarpUI() {
        if (!this.allTimeWarpButtons)
            return;

        for (var button of this.allTimeWarpButtons)
            (<any>button).show();
    }

    public static hideTimeWarpUI() {
        if (!this.allTimeWarpButtons)
            return;

        for (var button of this.allTimeWarpButtons)
            (<any>button).hide();
    }

    private static get allTimeWarpButtons(): Array<Object> {
        if (this._allTimeWarpButtons)
            return this._allTimeWarpButtons;

        if (!document.querySelector('time-warp-shape-button'))
            return null;

        this._allTimeWarpButtons = [];
        this._allTimeWarpButtons.push(document.querySelector('time-warp-close-button'));
        this._allTimeWarpButtons.push(document.querySelector('time-warp-shape-button'));
        this._allTimeWarpButtons.push(document.querySelector('time-warp-opacity-button'));
        this._allTimeWarpButtons.push(document.querySelector('time-warp-map-button'));

        return this._allTimeWarpButtons;
    }

}

TimeWarpButton.register();