// document.addEventListener("DOMContentLoaded", function() {
//     setInterval(function() {
//         document.getElementById("txt").innerHTML = clock.getCurrentContent();
//     }, 500);
//     //$("#clock").fitText();
// });

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

connection.onmessage = function(e) {
    let customCssBefore = clock.getCurrentCustomCSS();
    let currentMethodBefore = clock.getCurrentMethod();

    clock.parseMessage(e.data);

    // handle css changed
    if (clock.getCurrentCustomCSS() !== customCssBefore) {
        if (clock.getCurrentCustomCSS()) {
            $("style").html(clock.getCurrentCustomCSS());
        } else {
            $("style").html("");
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
            $("style").html("");
        }
    }

    //handle clock and display text function
    if (clock.getCurrentMethod() === "displayText") {
        //clear the interval of the clock
        clearInterval(intervalId);
        $("#screenmessagetext").html(clock.getCurrentContent());
        //call resize handler once
        display_text_resize_handler();
        //set resize handler as callback for resize event
        $(window).resize(display_text_resize_handler);
    } else {
        //remove resize handler from displaytext
        $(window).off("resize", display_text_resize_handler);
        intervalId = setInterval(function() {
            $("#txt").html(clock.getCurrentContent());
        }, 500);
        $("#clock").fitText();
    }
};
