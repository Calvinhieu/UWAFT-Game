var car;

function update() {
    keyInput();
}

function draw() {
    
}

function keyInput () {
	document.addEventListener('keydown', function(event) {
    	if(event.keyCode == 37) { // left
     		
    	}
    	else if(event.keyCode == 39) { // right
        	
    	}
	});
}

$(document).ready(function() {
	car = document.getElementById("car");
    setInterval(function() {
        update();
        draw();
    }, 1000/60);
});