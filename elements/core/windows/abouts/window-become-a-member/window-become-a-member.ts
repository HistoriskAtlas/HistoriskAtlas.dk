@component("window-become-a-member")
class WindowBecomeAMember extends polymer.Base implements polymer.Element {
    signupTap() {
        Common.dom.append(WindowMemberSignup.create());
    }
}

WindowBecomeAMember.register();