function send() {
	var c = document.getElementsByTagName("iframe")[0].contentWindow.connection;
	var start;
	var method = document.querySelector('input[name="method"]:checked').value;
	switch(method){
		case "realTime":
			break;
		case "countUp":
			start = document.getElementById('start_countUp').value;
			break;
		case "countDown":
			start = document.getElementById('start_countDown').value;
			break;
	}
	c.send(JSON.stringify({"method":method,"start":start}));
	return false;
}
