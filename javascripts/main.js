//@param: position of the cursor along the x axis
var cursorX = 0;
//@param: array with the position of scales
var scales = [];
//@param length of the video
var timeWhenVideoEnds = 10;
//@param current time in the video
var currentTimeOfTheVideo = 0;
//@param recording in a hash the sequence of like and dislike
var resultOfTheUser = [];


$(document).ready(function(){
    main();
});

//principal function to be run once document is ready
var main = function(){
    drawScale("scale", 10);
    drawCursor("cursor");
    moveObject("scale");
    var intervalID = setInterval(function(){
        recordPosition();
        if(currentTimeOfTheVideo >= timeWhenVideoEnds){
            sendData();
            clearInterval(intervalID);
        }
        console.log(resultOfTheUser);
    }, 1000);
};


//return an array with values between 0 and 10, and of length timeWhenVideoEnds
//@return{array}: array with random values between 0 and 10
var generateRandomArray = function(){
    var i = 0;
    var randArray = []
    for (i; i<timeWhenVideoEnds; i++){
        randArray.push(Math.floor(Math.random()*11));
    }
    return randArray;
}

//send as an ajax post request data regarding the watching of the video
var sendData = function(){
    $.ajax({
        type: "POST",
        url: "../testAjax.php",
        data: "test="+ JSON.stringify(resultOfTheUser),
        dataType: "html"
    })
        .done(function(data){
            console.log(data);
        }).fail(function(error){
            console.log(error);
        });

}

//record the current position of the cursor every second, we round to the
//closest scale since the cursor might go
var recordPosition = function(){
    var cursor = $("#cursor");
    var pos = cursor.offset().left + cursor.width()/2;
    var currentScale = 0;
    var scalesLength = scales.length;
    var i = 0;
    var closestScaleDist = Math.abs(pos - scales[0]);
    var tempDist = 0;
    for (i; i< scalesLength; i++){
        tempDist = Math.abs(pos - scales[i])
        if ( tempDist < closestScaleDist){
            currentScale = i;
            closestScaleDist = tempDist;
        }
    }
    //increment of one second after setInterval execute the function
    resultOfTheUser[currentTimeOfTheVideo] = currentScale;
    currentTimeOfTheVideo++;
}

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
    context.lineTo(scale.width(), height/2);
    context.stroke();
    for (i; i<numOfVerticalBars + 1; i++){
        scales.push(start);
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
    context.lineTo(width, height * 0.5);
    context.stroke();
    context.moveTo(width, height * 0.5);
    context.lineTo(width/2, 0);
    context.stroke();
    context.moveTo(width/2, 0);
    context.lineTo(0, height * 0.5);
    context.stroke();
    context.moveTo(0, height * 0.5);
    context.lineTo(0, height);
    context.stroke();
    context.fill();
}

//move object on the x axis
//@param{id}: id of the parent of the cursor
var moveObject = function(id){
    var object = $("#" + id);
    var mousedown = false;
    $("#cursor").mousedown(function(){
        mousedown = !mousedown;
    });
    object.mousemove(function(e){
        cursorX = e.pageX;
        if (mousedown){
            moveCursor($("#cursor"));
        }
    });
    /* use to stop moving when releasing the left click
    $(document).mouseup(function(){
        moveCursor($("#cursor"));
        mousedown = false;
    });*/

}

var moveCursor = function(object){
    var leftObj = object.offset().left;
    var topObj = object.offset().top;
    object.offset({top: topObj, left: cursorX - object.width()/2})
}
