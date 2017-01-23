@component("time-line")
class TimeLine extends polymer.Base implements polymer.Element {
    @property({ type: Boolean })
    public active: boolean;

    @property({ type: Boolean, value: false })
    public main: boolean;

    @property({ type: Object, notify:true }) //Notify?
    public map: HaMap & Object;

    @property({ type: Number, notify: true })
    public year: number;

    @property({ type: Number })
    private immediateYear: number;

    @property({ type: Boolean })
    public timeWarpActive: boolean;

    @property({ type: Number })
    public zoom: number;

    @property({ type: Boolean })
    public touchDevice: boolean;

    //@property({ type: Number, value: 1900, notify: true })
    //public min: number;
    //@property({ type: Number, value: 2000, notify: true })
    //public max: number;

    //private classWrapper: string = 'wrapper ' + (this.main ? 'wrapperLeft' : 'wrapperRight');
    //private classYear: string = 'year ' + (this.main ? 'HAPrimColor' : 'HASecColor');
    //private classSlider: string = this.main ? 'slider-left' : 'slider-right';
    private timelineMap: TimelineMap;
    private sliderCreated: boolean;

    ready() {
        $(this).attr("tabindex", -1)
        $(this).on('blur', () => {
            this.timelineMap.center();
        })
    }

    @observe('active')
    activeChanged() {
        if (this.active && !this.timelineMap) {
            this.timelineMap = new TimelineMap(this.$.mapDiv, this);
            var observer = new MutationObserver((mutation) =>
                this.fire('domChanged')
            )
            observer.observe(this, { attributes: true })
        }
    }

    @observe('year')
    yearChanged() {
        if (this.timelineMap) 
            this.timelineMap.updateYear();
    }

    @observe('timeWarpActive')
    timeWarpActiveChanged() {
        $(this).css('width', this.timeWarpActive ? '50%' : (this.main ? '100%' : '0%'))
    }
    
    @observe('zoom')
    zoomChanged() {
        if (this.timelineMap)
            this.timelineMap.zoom(this.zoom);
    }

    public updateSize() {
        this.timelineMap.updateSize();
    }

    public showSlider(active: boolean): boolean {
        if (this.touchDevice)
            return false;

        if (active)
            this.sliderCreated = true;

        return this.sliderCreated;
    }

}

TimeLine.register();