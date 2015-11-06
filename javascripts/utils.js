var wasConnectionLost = false;

var isRecordingPossible = false;

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
var onVideoLoaded = function(){
	isRecordingPossible = true;
    return Math.floor(video.duration);
}

var startRecording = function(videoLength){
	var intervalID = setInterval(function(){
		if(currentTimeOfTheVideo >= videoLength){
			isEnded = true;
			clearInterval(intervalID);
		}
		recordPosition();
		if (isConnected){
			sendOneSecond(currentUserId, currentSecond, currentCursorValue);
		}else{
			wasConnectionLost = true;
			saveValuesInBackupArray();
		}

	}, INTERVAL_DELTA);
}

//check connection every 100 ms,
//send the backup datas when connection is reestablished
var checkDisconnected = function(videoLength){
	var intervalDuringDisconnection = setInterval(function(){
	checkConnection();
	if (isConnected && wasConnectionLost){
		sendBackupArray();
		clearInterval(intervalDuringDisconnection);
		wasConnectionLost = false;
	} else{
		//console.log("Not connected or connection was not lost");
	}
	if(!wasConnectionLost && currentTimeOfTheVideo >= videoLength){
		isEnded = true;
		clearInterval(intervalDuringDisconnection);
	}
	}, INTERVAL_DELTA/2);
}

var init = function(video, videoLength){
	if (isRecordingPossible){
		video.play();
		isEnded? "" : startRecording(videoLength);
		checkDisconnected(videoLength);
	}
}
