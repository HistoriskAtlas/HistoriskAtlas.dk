@component("panel-intro-beta")
class PanelIntroBeta extends polymer.Base implements polymer.Element {
    feedbackTap() {
        Common.dom.append(WindowFeedback.create());
    }
}

PanelIntroBeta.register();