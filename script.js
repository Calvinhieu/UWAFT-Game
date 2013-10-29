var c; //canvas
var car; //car object
var ctx; //context (to draw)
var FPS; //FPS value
var delta; //delta time between frames
var current; //ms elapsed of current frame
var previous; //ms elapsed of last frame
var left; //left key boolean
var right; //right key boolean

Car = function() { //Car object
    this.x = 240; //xpos
    this.y = 600; //ypos
    this.width = 60; //width
    this.height = 100; //height
    this.xspeed = 250; //xspeed
    this.yspeed = 2; //yspeed
    img = new Image; //car image
    img.src = "car.png"; //car source
};

function moveCar () { //update car position
    if(car.x >= 0) {
        if(left) car.x-=car.xspeed*delta; //move left
    }
    if(car.x <= 500-car.width) {
        if (right) car.x+=car.xspeed*delta; //move right
    }
    if (car.y > 500) {
        car.y-=car.yspeed; //update car's vertical
    }
}

function setDelta () {
    current = Date.now(); //ms at current time
    delta = (current-previous)/1000; //seconds since last frame
    previous = Date.now(); //ms at current time
}

function keyInput () { //keyboard input function
    document.addEventListener('keydown', function(event) {//add listener (KEYDOWN)
        if(event.keyCode == 37) { // left
            left = true;
        }
        else if(event.keyCode == 39) { // right
            right = true;
        }
    });
    document.addEventListener('keyup', function(event) {//add listener (KEYUP)
        if(event.keyCode == 37) { // left
            left = false;
        }
        else if(event.keyCode == 39) { // right
            right = false;
        }
    });
}

function update() { //update method
    keyInput(); //check for keyboard input
    setDelta(); //evaluate time (ms) from last frame
    moveCar(); //update car position
}

function draw() { //draw method
    ctx.fillStyle = "#222"; //background color
    ctx.fillRect(0,0,500,700); //redraw background
    ctx.drawImage(img,car.x,car.y); //draw car image
}

$(document).ready(function() { //document loaded
	FPS=60; //set to 60fr/sec
    left = false; //left boolean to false
    right = false; //right boolean to true
    previous = 0;

    c = document.getElementById("canvas"); //init canvas var
    car = new Car(); //create car
    c.width=500; //set canvas size
    c.height=700; //set canvas height
    ctx=c.getContext("2d"); //init context (to draw)

    setInterval(function() { //game loop
        update(); //update 
        draw(); //draw
    }, 1000/FPS); //set FPS to 60fps
});