update = function() {
    console.log("uodpatea lol");
}

draw = function() {
    console.log("draw");
}

$(document).ready(function() {
    setInterval(function() {
        update();
        draw();
    }, 1000/60);
});