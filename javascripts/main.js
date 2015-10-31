$(document).ready(function(){
    main();
});
//principal function to be run once document is ready
var main = function(){
    drawScale("scale", 11);
    drawCursor("cursor");
};

//draw the scale used with a canvas
//@param {id}: id of the tag used to create the scale
//@param {numOfVerticalBars}: number of Vertical bars for the scale
var drawScale = function(id, numOfVerticalBars){
    var scale = $("#" + id);
    var context = document.getElementById(id).getContext('2d');
    var widthOneBar = scale.width()/numOfVerticalBars;
    var height = scale.height();
    var i = 0;
    context.beginPath();
    start = 0
    context.moveTo(0, height/2);
    context.lineTo(scale.width() - widthOneBar, height/2);
    context.stroke();
    for (i; i<numOfVerticalBars; i++){
        context.moveTo(start,0);
        context.lineTo(start,height);
        context.stroke();
        start += widthOneBar;
    }
}
//draw a cursor with a canvas
//@param{id}: id of the tag used to create the cusrsor
var drawCursor = function(id){
    var cursor = $("#" + id);
    var context = document.getElementById(id).getContext('2d');
    var height = cursor.height();
    var width = cursor.width();
    context.fillStyle="black";
    context.beginPath();
    context.moveTo(0,height);
    context.lineTo(width,height);
    context.stroke();
    context.moveTo(width, height);
    context.lineTo(width, height * 0.25);
    context.stroke();
    context.moveTo(width, height * 0.25);
    context.lineTo(width/2, 0);
    context.stroke();
    context.moveTo(width/2, 0);
    context.lineTo(0, height * 0.25);
    context.stroke();
    context.moveTo(0, height * 0.25);
    context.lineTo(0, height);
    context.stroke();
    context.fill();
}
