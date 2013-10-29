function update() {
    
}

function draw() {
    
}

$(document).ready(function() {
    setInterval(function() {
        update();
        draw();
    }, 1000/60);
});