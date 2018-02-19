(function(exports) {
    var currentTime = new Date();
    var currentText = "";
    var currentMethod = "realTime";
    var currentCustomCSS = "";
    function getCurrentTime() {
        var h = padStart(currentTime.getHours(), "\xa0");
        var m = padStart(currentTime.getMinutes(), "0");
        var s = padStart(currentTime.getSeconds(), "0");
        return h + ":" + m + ":" + s;
    }

    function getCurrentContent() {
        //decide if text or time should be displayed
        if (currentMethod === "displayText") {
            return currentText;
        } else {
            return getCurrentTime();
        }
    }
    // FIXME: Remove this when Firefox 48 and Edge 15 is common enough (use String.padStart)
    function padStart(i, padding) {
        if (i < 10) {
            i = padding + i;
        }
        return i;
    }
    function realTime() {
        currentTime = new Date();
    }
    function countDown() {
        currentTime.setSeconds(currentTime.getSeconds() - 1);
    }
    function countUp() {
        currentTime.setSeconds(currentTime.getSeconds() + 1);
    }
    function parseTime(t) {
        var t_ary = t.split(":");
        return new Date(1970, 1, 1, t_ary[0], t_ary[1], t_ary[2], 0);
    }

    function getCurrentMethod() {
        return currentMethod;
    }
    function getCurrentCustomCSS() {
        return currentCustomCSS;
    }
    var timer;
    function parseMessage(e) {
        console.log("received: %s", e);
        currentCustomCSS = "";
        var instructions = JSON.parse(e);
        currentMethod = instructions.method;
        switch (currentMethod) {
            case "realTime":
                clearInterval(timer);
                timer = setInterval(realTime, 1000);
                break;
            case "countUp":
                currentTime = parseTime(instructions.start);
                clearInterval(timer);
                timer = setInterval(countUp, 1000);
                break;
            case "countDown":
                currentTime = parseTime(instructions.start);
                clearInterval(timer);
                timer = setInterval(countDown, 1000);
                break;
            case "displayText":
                currentText = instructions.text;
                currentCustomCSS = instructions.custom_css;
        }
    }

    exports.parseMessage = parseMessage;
    exports.getCurrentContent = getCurrentContent;
    exports.getCurrentMethod = getCurrentMethod;
    exports.getCurrentCustomCSS = getCurrentCustomCSS;
})(typeof exports === "undefined" ? (this["clock"] = {}) : exports);
