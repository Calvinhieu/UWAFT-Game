var c; //canvas
var car; //car object
var ctx; //context (to draw)
var FPS; //FPS value
var delta; //delta time between frames
var current; //ms elapsed of current frame
var previous; //ms elapsed of last frame
var left; //left key boolean
var right; //right key boolean
var battery; //test battery instance
var fuel; //test fuel instance
var fuelDisplay; //fuel display meter
var batteryDisplay; //battery display meter
var itemSize; //size of pick-up items
var trigger; //boolean for road animation
var road1; //road 1 (test)
var road2; //road 2 (test)
var lose; //lose boolean
var batterySpawnTime; //for battery spawn rate
var fuelSpawnTime; //for fuel spawn rate
var minSpawnInterval; //minimum time between spawn intervals


Car = function() { //Car object
    this.x = 240; //xpos
    this.y = 600; //ypos
    this.width = 60; //width
    this.height = 100; //height
    this.xspeed = 250; //xspeed
    this.yspeed = 200; //yspeed
    this.fuelMax = 100; //maximum fuel value
    this.batteryMax = 100; //maximum battery value
    this.fuel = this.fuelMax; //fuel
    this.battery = this.batteryMax; //battery
    this.fuelConsumptionRate = 0.05; //car's fuel consumption rate per frame
    this.batteryConsumptionRate = 0.08; //car's battery consumption rate per frame
    this.batteryRechargeRate = 0.05; //car's battery recharge rate per frame
    this.batteryInUse = true; //is car using battery
    this.img = new Image; //car image
    this.img.src = "MinCar.png"; //car image source
};

Road = function(y,src) { //Road object
    this.x = 0; //x-position
    this.y = y; //y-position
    this.img = new Image; //road image
    this.img.src = src; //road image source
};

PickUpItem = function (x,y,type,src) { //Batteries and Fuel items
    this.x = x; //x-position
    this.y = y; //y-position
    this.img = new Image; //fuel/battery image
    this.img.src = src;
    if (type == 'fuel') { 
        this.value = 10; //fuel recharges by 10
        this.color = 'orange'; //represented by orange
    }
    else if (type == 'battery') { 
        this.value = 15; //battery recharges by 15
        this.color = 'blue'; //represented by blue
    }
}

DisplayMeter = function (x,y,type) { //top and right meters
    this.x = x; //x-position
    this.y = y; //y-position
    this.width = 10; //bar width
    this.border = 1; //bar border
    this.borderColor = 'white'; //border color
    if (type == 'fuel') {
        this.height = car.fuelMax;
        this.color = 'orange'; //orange represents fuel
    }
    else if (type == 'battery') {
        this.height = car.batteryMax;
        this.color = 'blue'; //blue represents battery
    }
}

function moveCar () { //update car position
    if(car.x >= 158) {
        if(left) car.x-=car.xspeed*delta; //move left
    }
    if(car.x <= 336-car.width) {
        if (right) car.x+=car.xspeed*delta; //move right
    }
    if (car.y > 500) {
        car.y-=car.yspeed*delta; //update car's vertical
    }
    else {
        trigger = true; //car is in static position
    }
}

function updateCarLevels () { //update fuel and battery levels of car
    if (car.fuel <= 0 && car.battery <= 0) lose = true; //check for gameover
   
    if (car.batteryInUse) {
        if (car.battery > 0) car.battery-=car.batteryConsumptionRate; // use battery
    }

    if (!car.batteryInUse) {
        if (car.fuel > 0) car.fuel-=car.fuelConsumptionRate; // use fuel 
        car.battery+=car.batteryRechargeRate; // charge battery
    }

    if (car.battery <= car.batteryMax*0.2) car.batteryInUse = false; //if car battery is at lower limit (20%), stop using battery
    else if (car.battery >= car.batteryMax*0.25) car.batteryInUse = true; //if car battery is at upper limit (25%), start using battery
}

function updateRoad () { //update road position
    road1.y+=car.yspeed*delta; //move road down
    if(road1.y >= c.height) road1.y=-c.height; //reset road to top
    road2.y+=car.yspeed*delta; //move road down
    if(road2.y >= c.height) road2.y=-c.height; //reset road to top
}

function updateBattery () { //move battery items (to be modified)
    if (battery) {
        battery.y+=car.yspeed*delta; //move
        if (battery.y > c.height) battery = null; //delete from memory
        if (battery.y+itemSize>=car.y && battery.y<car.y+car.height && battery.x+itemSize>=car.x && battery.x<=car.x+car.width) {
            car.battery+=battery.value;
            if (car.battery > car.batteryMax) car.battery=car.batteryMax;
            battery = null; //collision detection (delete from memory)
        }
    }
    else {
        if (Math.random() < 0.01) spawnInstances();
    }
}

function updateFuel () { //move fuel items (to be modified)
    if (fuel) {
        fuel.y+=car.yspeed*delta; //move
        if (fuel.y > c.height) fuel = null; //delete from memory
        if (fuel.y+itemSize>=car.y && fuel.y<car.y+car.height && fuel.x+itemSize>=car.x && fuel.x<=car.x+car.width) {
            car.fuel += fuel.value;
            if (car.fuel > car.fuelMax) car.fuel=car.fuelMax;
            fuel = null; //collision detection (delete from memory)
        }
    }
}

function spawnBattery () { //spawn new battery (to be obsolete)
    if (!battery) //if none... 
        battery = new PickUpItem (Math.random()*(158-itemSize)+184,Math.random()*(c.height/2),'battery','Battery.png');//...create
}

function spawnFuel () { //spawn new fuel (to be obsolete)
    if (!fuel) //if none...
        fuel = new PickUpItem (Math.random()*(158-itemSize)+184,Math.random()*(c.height/2),'fuel','Fuel.png'); //...create
}

function setDelta () { //calculate time (ms) between frames
    current = Date.now(); //ms at current time
    delta = (current-previous)/1000; //seconds since last frame
    previous = Date.now(); //ms at current time
}

function keyInput () { //keyboard input function
    document.addEventListener('keydown', function(event) {//add listener (KEYDOWN)
        if(event.keyCode == 37 && !left) { // left
            left = true;
        }
        else if(event.keyCode == 39 && !right) { // right
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

function spawnInstances () {
    spawnBattery(); //spawn battery pick-up items
    spawnFuel(); //spawn fuel pick-up items
}

function updateInstances () {
    moveCar(); //update car position
    if (trigger) { // if car is in static position
        updateBattery(); //update battery item position
        updateFuel(); //update fuel item position
        updateRoad(); //update road scrolling
        updateCarLevels(); //update car values
    }
}

function update() { //update method
    if (!lose) {
        keyInput(); //check for keyboard input
        setDelta(); //evaluate time (ms) from last frame
        updateInstances(); //update entities positions (car, items)
    }
}

function draw() { //draw method
    ctx.drawImage(road1.img,0,0,c.width,(c.height-road1.y),road1.x,road1.y,c.width,(c.height-road1.y)); //draw & clip road
    ctx.drawImage(road2.img,0,0,c.width,(c.height-road2.y),road2.x,road2.y,c.width,(c.height-road2.y)); //draw & clip road
    ctx.drawImage(car.img,car.x,car.y); //draw car image
    if (battery) ctx.drawImage(battery.img,battery.x,battery.y); // draw battery
    if (fuel) ctx.drawImage(fuel.img,fuel.x,fuel.y); //draw fuel

    // draw fuel and battery meters
    ctx.fillStyle = fuelDisplay.borderColor;
    ctx.fillRect (batteryDisplay.x-batteryDisplay.border,batteryDisplay.y-batteryDisplay.border,batteryDisplay.width+batteryDisplay.border*2,batteryDisplay.height+batteryDisplay.border*2);
    ctx.fillRect (fuelDisplay.x-fuelDisplay.border,fuelDisplay.y-fuelDisplay.border,fuelDisplay.width+fuelDisplay.border*2,fuelDisplay.height+fuelDisplay.border*2);
    ctx.fillStyle = batteryDisplay.color;
    ctx.fillRect (batteryDisplay.x,batteryDisplay.y+(batteryDisplay.height-car.battery),batteryDisplay.width,car.battery);
    ctx.fillStyle = fuelDisplay.color;
    ctx.fillRect (fuelDisplay.x,fuelDisplay.y+(fuelDisplay.height-car.fuel),fuelDisplay.width,car.fuel);
}

$(document).ready(function() { //document loaded
	FPS=60; //set to 60fr/sec
    lose = false; //not lose
    left = false; //left boolean to false
    right = false; //right boolean to true
    previous = Date.now(); //initially set "time since last frame" to 0
    itemSize = 20; //pick-up item size
    trigger = false; //for road animation

    c = document.getElementById("canvas"); //init canvas var
    c.width=500; //set canvas size
    c.height=700; //set canvas height
    ctx=c.getContext("2d"); //init context (to draw)

    car = new Car(); //create car
    road1 = new Road (0,"MinRoad.png"); //road image 1
    road2 = new Road (-c.height,"MinRoad.png"); //road image 2
    fuelDisplay = new DisplayMeter (30,10,'fuel'); //inst display meter for car's fuel level
    batteryDisplay = new DisplayMeter (10,10,'battery'); //inst display meter for car's battery level

    spawnInstances();
    loop();
});

function loop () {
    requestAnimationFrame(loop);
    update(); //update 
    draw(); //draw
}