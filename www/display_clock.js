document.addEventListener("DOMContentLoaded", function() {
	setInterval(function(){
		document.getElementById('txt').innerHTML = clock.getCurrentTime();
	}, 500);
	$("#clock").fitText();
});

// getting domain name from fqdn
var domain = window.location.host.match(/^[^\.]*\.([^:]*)/);
if (domain) {
	domain = domain[1];
} else {
	domain = "";
}

var connection=new WebSocket("ws://clock."+domain+":8080",'json');
function config(data) {
	connection.send(JSON.stringify(data));
}

connection.onmessage = function (e) {
	clock.parseMessage(e.data);
};
