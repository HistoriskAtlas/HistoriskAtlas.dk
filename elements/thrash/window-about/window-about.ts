@component("window-about")
class WindowAbout extends polymer.Base implements polymer.Element {
    privacyTap() {
        Common.dom.append(WindowPrivacy.create());
    }
    termsOfUseTap() {
        Common.dom.append(WindowTermsOfUse.create());
    }
}

WindowAbout.register();