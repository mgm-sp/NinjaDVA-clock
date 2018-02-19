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
            transmit.custom_css = `
            @font-face {
                font-family: 'Linux Biolinum O Regular';
                src: url(LinBiolinum.otf);
            }

            #screenmessagetext {
                font: 2.1em 'Linux Biolinum O Regular', sans-serif;
                color: white;
                display: inline-block;
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%,-50%);
                margin: 0;
                text-shadow: none;
                border: hidden;
            }
            `;
            break;
        default:
            return true;
    }
    c.send(JSON.stringify(transmit));
    return false;
}
