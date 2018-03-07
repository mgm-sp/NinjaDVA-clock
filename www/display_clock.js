// getting domain name from fqdn
var domain = window.location.host.match(/^[^\.]*\.([^:]*)/);
if (domain) {
    domain = domain[1];
} else {
    domain = "";
}
console.log("DOMAIN is: " + domain);

var connection = new WebSocket("ws://clock." + domain + ":8080", "json");

function config(data) {
    connection.send(JSON.stringify(data));
}
var intervalId;

function display_text_resize_handler() {
    // set width and height for displaytext as big as possible
    $("#screenmessage").css("width", $(window).width());
    $("#screenmessage").css("height", $(window).height());
    $("#screenmessage").textfill({
        changeLineHeight: false,
        maxFontPixels: 800
    });
}

//add change css function to global context
window.clockwidget_set_custom_css = function(sCSS) {
    $("style").html(sCSS);
};

connection.onmessage = function(e) {
    let customCssBefore = clock.getCurrentCustomCSS();
    let currentMethodBefore = clock.getCurrentMethod();

    clock.parseMessage(e.data);

    // handle css changed
    if (clock.getCurrentCustomCSS() !== customCssBefore) {
        if (clock.getCurrentCustomCSS()) {
            clockwidget_set_custom_css(clock.getCurrentCustomCSS());
        } else {
            clockwidget_set_custom_css("");
        }
    }
    //handle method changed
    if (clock.getCurrentMethod() !== currentMethodBefore) {
        if (clock.getCurrentMethod() == "displayText") {
            $("#clock").hide();
            $("#screenmessage").show();
        } else {
            $("#clock").show();
            $("#screenmessage").hide();
            clockwidget_set_custom_css("");
        }
    }

    //handle clock and display text function
    if (clock.getCurrentMethod() === "displayText") {
        //clear the interval of the clock
        clearInterval(intervalId);
        $("#screenmessagetext").text(clock.getCurrentContent());
        //call resize handler once
        display_text_resize_handler();
        //set resize handler as callback for resize event
        $(window).resize(display_text_resize_handler);
    } else {
        //remove resize handler from displaytext
        $(window).off("resize", display_text_resize_handler);
        intervalId = setInterval(function() {
            $("#txt").text(clock.getCurrentContent());
        }, 500);
        $("#clock").fitText();
    }
};
