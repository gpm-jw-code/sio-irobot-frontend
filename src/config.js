var _navStyle = "info"
var configs = {
    navTitle: "SIO-IROBOT",
    get navStyle() {
        var navStyle = localStorage.getItem('style')
        if (navStyle == null) {
            localStorage.setItem('style', _navStyle)
        }
        else {
            _navStyle = navStyle;
        }
        return _navStyle
    },
    set navStyle(style) {
        _navStyle = style;
        localStorage.setItem('style', _navStyle)
    }
}

export default configs;
