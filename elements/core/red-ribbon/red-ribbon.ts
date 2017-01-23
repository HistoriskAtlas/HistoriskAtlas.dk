@component("red-ribbon")
class RedRibbon extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, notify: true })
    public show: boolean;

    private panel: JQuery;

    ready() {
        this.panel = $('#leftPanel:first');
        this.panel.css('-webkit-filter', 'blur(10px)');
        this.panel.css('transition', '-webkit-filter 3s 1s');

        $(document).one('keydown', () => {
            $(this.$.curtain).css('top', (-$(window).height()) + 'px')

            $(document).one('keydown', () => {
                $(this.$.scissorsOpen1).css('display', 'none')
                $(this.$.scissorsOpen2).css('display', 'none')
                $(this.$.scissorsClosed).css('display', 'inline')
                $(this).css('opacity', 0)
                this.panel.css('-webkit-filter', 'none');

                $(this.$.ribbon1).css('transform', 'rotate(90deg)')
                $(this.$.ribbon1).css('left', '-100px')
                $(this.$.ribbon2).css('transform', 'rotate(-90deg)')
                $(this.$.ribbon2).css('right', '-100px')

                setTimeout(() => {
                    this.show = false;
                }, 4000)
            });
        });

        $(window).resize(() => {
            this.updateClip();
        })

        this.updateClip();
    }

    private updateClip() {
        $(this.$.ribbon1).css('clip', 'rect(0px,' + ($(window).width() / 2) + 'px,135px,0px)')
        $(this.$.ribbon2).css('clip', 'rect(0px,10000px,135px,' + ($(window).width() / 2) + 'px)')
    }
}

RedRibbon.register();