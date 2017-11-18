var displayTime = new Date();
function realTime(){
	displayTime = new Date();
	displayClock();
}
function countDown(){
	displayTime.setSeconds(displayTime.getSeconds()-1);
	displayClock();
}
function countUp(){
	displayTime.setSeconds(displayTime.getSeconds()+1);
	displayClock();
}
function setTime(time){
	displayTime = time;
}
function displayClock() {
	var h = padStart(displayTime.getHours(),"\xa0");
	var m = padStart(displayTime.getMinutes(),"0");
	var s = padStart(displayTime.getSeconds(),"0");
	document.getElementById('txt').innerHTML = h + ":" + m + ":" + s;
}
// FIXME: Remove this when Firefox 48 and Edge 15 is common enough (use String.padStart)
function padStart(i,padding) {
	if (i < 10) {i = padding + i};
	return i;
}
var timer;
document.addEventListener("DOMContentLoaded", function() {
	timer = setInterval(realTime, 1000);
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

function parseTime(t){
	var t_ary = t.split(":");
	return new Date(1970,1,1,t_ary[0],t_ary[1],t_ary[2],0);
}

connection.onmessage = function (e) {
	var instructions = JSON.parse(e.data);
	switch(instructions.method){
		case "realTime":
			clearInterval(timer);
			timer = setInterval(realTime, 1000);
			break;
		case "countUp":
			setTime(parseTime(instructions.start));
			clearInterval(timer);
			timer = setInterval(countUp, 1000);
			break;
		case "countDown":
			setTime(parseTime(instructions.start));
			clearInterval(timer);
			timer = setInterval(countDown, 1000);
			break;
	}
};
