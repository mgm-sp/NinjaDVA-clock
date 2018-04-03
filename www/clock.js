(function(exports) {
    var currentTime = new Date();
    var currentText = "";
    var currentMethod = "realTime";
    var currentCustomCSS = "";
    var timer;
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
        // handle if countdown reaches 0 -- than count up
        if (currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds() == 0) {
            currentMethod = "countUp";
            clearInterval(timer);
            currentTime.setSeconds(currentTime.getSeconds() + 1);
            timer = setInterval(countUp, 1000);
            currentCustomCSS = `
            #digit_bg {
                color: #2f0c0c;
                text-shadow: 0px 0px 10px rgba(212, 16, 16, 0.6);
            }
            #txt {
                color: rgba(221, 34, 34, 0.75);
                text-shadow: 0 0 0.25em rgba(221, 34, 34, 0.3), 0 0 0.15em #dd2222;
            }`;
            //change css if this script is interpreted on client
            if (typeof window !== "undefined") {
                window.clockwidget_set_custom_css(currentCustomCSS);
            }
        } else {
            currentTime.setSeconds(currentTime.getSeconds() - 1);
        }
    }
    function countUp() {
        currentTime.setSeconds(currentTime.getSeconds() + 1);
    }
    function parseTime(t) {
        var t_ary = t.split(":");
        // test whether there are 3 element and every element is as number
        if (
            t_ary.length == 3 &&
            t_ary.every(e => {
                return !isNaN(Number(e));
            })
        ) {
            return new Date(1970, 1, 1, t_ary[0], t_ary[1], t_ary[2], 0);
        } else {
            return new Date();
        }
    }

    function getCurrentMethod() {
        return currentMethod;
    }
    function getCurrentCustomCSS() {
        return currentCustomCSS;
    }
    function parseMessage(e) {
        console.log("received: %s", e);
        currentCustomCSS = "";
        try {
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
        } catch (err) {
            console.log("error while processing message: %s", String(err));
        }
    }

    exports.parseMessage = parseMessage;
    exports.getCurrentContent = getCurrentContent;
    exports.getCurrentMethod = getCurrentMethod;
    exports.getCurrentCustomCSS = getCurrentCustomCSS;
})(typeof exports === "undefined" ? (this["clock"] = {}) : exports);
