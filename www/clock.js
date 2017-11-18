(function(exports){

	var currentTime = new Date();
	function getCurrentTime(){
		var h = padStart(currentTime.getHours(),"\xa0");
		var m = padStart(currentTime.getMinutes(),"0");
		var s = padStart(currentTime.getSeconds(),"0");
		return h + ":" + m + ":" + s;
	}
	// FIXME: Remove this when Firefox 48 and Edge 15 is common enough (use String.padStart)
	function padStart(i,padding) {
		if (i < 10) {i = padding + i};
		return i;
	}
	function realTime(){
		currentTime = new Date();
	}
	function countDown(){
		currentTime.setSeconds(currentTime.getSeconds()-1);
	}
	function countUp(){
		currentTime.setSeconds(currentTime.getSeconds()+1);
	}
	function parseTime(t){
		var t_ary = t.split(":");
		return new Date(1970,1,1,t_ary[0],t_ary[1],t_ary[2],0);
	}

	var currentMethod = "realTime";
	function getCurrentMethod(){
		return currentMethod;
	}
	var timer;
	function parseMessage(e) {
		//console.log('received: %s', e);
		var instructions = JSON.parse(e);
		currentMethod = instructions.method;
		switch(currentMethod){
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
		}
	};

	exports.parseMessage = parseMessage;
	exports.getCurrentTime = getCurrentTime;
	exports.getCurrentMethod = getCurrentMethod;

})(typeof exports === 'undefined'? this['clock']={}: exports);
