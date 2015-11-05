//@author Adonis Settouf <adonis.settouf@gmail.com>


//@param INTERVAL_DELTA int - set the delta of execution of the setInterval used for recording
var INTERVAL_DELTA = 1000;
//@param cursorX int - position of the cursor along the x axis
var cursorX = 0;
//@param currentUserId int - User created for this recording
var currentUserId = 0;
//@param currentSecond int - Current time of the video
var currentSecond = 0;
//@param currentCursorValue int - Current value of the cursor
var currentCursorValue = 5;
//@param scales array - the position of the scales
var scales = [];
//@param timeWhenVideoEnds int - length of the video in seconds
var timeWhenVideoEnds = 10;
//@param currentTimeOfTheVideo int - current time in the video in seconds
var currentTimeOfTheVideo = 0;
//@param isConnected boolean - Switch to false if connection is interrupted
var isConnected = true;
//@param backupArray array - Array stored in local storage in case of connection failure
var backupArray = {};


$(document).ready(function(){
    main();
});

//principal function to be run once document is ready
var main = function(){
    drawScale("scale", 10);
    drawCursor("cursor");
    moveObject("scale");
	retrieveUserId();
	var wasConnectionLost = false;
    var intervalID = setInterval(function(){
        if(currentTimeOfTheVideo >= timeWhenVideoEnds){
            clearInterval(intervalID);
        }

		recordPosition();
		if (isConnected){
			sendOneSecond(currentUserId, currentSecond, currentCursorValue);
		}else{
			wasConnectionLost = true;
			createBackupArray();
		}

    }, INTERVAL_DELTA);
	//check connection every 100 ms,
	//send the backup datas when connection is reestablished
	var intervalDuringDisconnection = setInterval(function(){
		checkConnection();
		console.log(isConnected && wasConnectionLost);
		if (isConnected && wasConnectionLost){
			sendBackupArray();
			clearInterval(intervalDuringDisconnection);
            wasConnectionLost = false;
		} else{
			console.log("Not connected or connection was not lost");
		}
        if(!wasConnectionLost && currentTimeOfTheVideo >= timeWhenVideoEnds){
            clearInterval(intervalDuringDisconnection);
        }
	}, 100);
};

var checkConnection = function(){
	$.ajax({
	type: "GET",
	url: "../php/sendDataToDB.php",
	data: "isConnected"
	})
	.done(function(data){
        isConnected = true;
    }).error(function(error){
        isConnected = false;
    });
}

var createBackupArray = function(){
	backupArray = JSON.parse(localStorage.getItem("backupArray"));
	backupArray.currentUserValues.push({"Second" : currentSecond,
	"Value" : currentCursorValue});
	localStorage.setItem("backupArray", JSON.stringify(backupArray));
}

var sendBackupArray = function(){

	backupArray = JSON.parse(localStorage.getItem("backupArray"));
	console.log(backupArray);
	var i = 0;
	for (i; i< backupArray.currentUserValues.length; i++){
		sendOneSecond(currentUserId,backupArray.currentUserValues[i].Second, backupArray.currentUserValues[i].Value);
	}
	backupArray = {currentUserValues: []};
	localStorage.setItem("backupArray", JSON.stringify(backupArray));

}
//return an array with values between 0 and 10, and of length timeWhenVideoEnds
//@return array - array with random values between 0 and 10
var generateRandomArray = function(){
    var i = 0;
    var randArray = []
    for (i; i<timeWhenVideoEnds; i++){
        randArray.push(Math.floor(Math.random()*11));
    }
    return randArray;
}

//retrieve the next user id
var retrieveUserId = function(){
    $.ajax({
	type: "GET",
	url: "../php/sendDataToDB.php",
	data: "uid"
	})
	.done(function(data){
        console.log(data);
        currentUserId = data.split("<")[0];
		backupArray = {currentUserValues: []};
		localStorage.setItem("backupArray", JSON.stringify(backupArray));
		console.log(currentUserId);
    }).error(function(error){
        console.log(error);
    });
}


//post one second to DB with ajax POST request
var sendOneSecond = function(userId, second, value){
    $.ajax({
        type: "POST",
        url: "../php/sendDataToDB.php",
        data: {"uid" : userId,
                "second" : second,
                "value" : value
        }
    })
	.done(function(data){
		console.log(data);
	}).fail(function(error){
		isConnected = false;
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
    currentSecond = currentTimeOfTheVideo;
    currentCursorValue = currentScale;
    currentTimeOfTheVideo++;
}

//draw the scale used with a canvas
//@param string id - id of the tag used to create the scale
//@param int numOfVerticalBars - number of Vertical bars for the scale
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
//@param string id - id of the tag used to create the cusrsor
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
//@param string id - id of the parent of the cursor
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
