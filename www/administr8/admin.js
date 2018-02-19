function send() {
    var c = document.getElementsByTagName("iframe")[0].contentWindow.connection;
    var start;
    var method = document.querySelector('input[name="method"]:checked').value;
    var transmit = { method: method };
    switch (method) {
        case "realTime":
            break;
        case "countUp":
            transmit.start = document.getElementById("start_countUp").value;
            break;
        case "countDown":
            transmit.start = document.getElementById("start_countDown").value;
            break;
        case "displayText":
            transmit.text = document.getElementById("text_to_be_displayed").value;
            let lineBreakOption = "";
            if (document.getElementById("evaluate_line_break").checked) {
                lineBreakOption = "white-space: pre;";
            }
            transmit.custom_css = `
            @font-face {
                font-family: 'Hack Regular';
                src: url(Hack-Regular.ttf);
            }

            #screenmessagetext {
                font: 2.1em 'Hack Regular', monospace;
                color: white;
                display: inline-block;
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%,-50%);
                margin: 0;
                text-shadow: none;
                border: hidden;
                ${lineBreakOption}
            }
            `;
            break;
        default:
            return true;
    }
    c.send(JSON.stringify(transmit));
    return false;
}

$(document).ready(function() {
    //set click handler for live mode checkbox
    $("#live_mode").click(function() {
        if ($("#live_mode").is(":checked")) {
            $("#text_to_be_displayed").on("input propertychange", function() {
                send();
            });
        } else {
            $("#text_to_be_displayed").off("input propertychange");
        }
    });
});
