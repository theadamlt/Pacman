var Keyboard = function(updateInterval) {
	var table = {
		"Backspace": 8,
		"Tab": 9,
		"Enter": 13,
		"PageUp": 33,
		"PageDown": 34,
		"End": 35,
		"Home": 36,
		"Left": 37,
		"Up": 38,
		"Right": 39,
		"Down": 40,
		"Insert": 45,
		"Delete": 46
	};
	var keys = [];
	var listeners = []; // function(keyevent,keynum)
	
	this.setListener = function(keynum,listener) { 
		if (typeof(keynum)=="string") keynum = table[keynum];
		if (typeof(keynum)!="number") throw "Keyboard exception: First argument to setListener is not a key number.";
		listeners[keynum] = listener; 
	}
	this.notify = function() {
		for (var i=0;i<keys.length;++i) if (keys[i] && listeners[i]) try {
			listeners[i](i);
		} catch(Ex) {}
	}
	document.onkeydown = function(e) {		
		e=e||window.event; 
		keys[e.which||e.keyCode]=true;
		return true;
	}	
	document.onkeyup = function(e) {		
		e=e||window.event; 
		keys[e.which||e.keyCode]=false;
		return true;
	}
	var intervalID = 0; //window.setInterval(this.notify,updateInterval||1);	
	this.start = function(updInterval) { if (intervalID==0) intervalID = window.setInterval(this.notify,updInterval||updateInterval||1); }
	this.stop = function() { if (intervalID>0) window.clearInterval(intervalID); intervalID = 0; }

	this.start();
	return this;
}
var keyboard = new Keyboard(100);
/*
*/
// Sample usage
/*                   KEYNUM VALUE
keyboard.setListener(37,function(keynum){
	// Do stuff on 'arrow left'
});

keyboard.setListener('Left',function(keynum){
	// Do stuff on 'arrow right'
});					
*/