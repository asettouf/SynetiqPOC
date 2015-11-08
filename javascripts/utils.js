//@param wasConnectionLost boolean - If connection was lost, prepare to send
//backupArray when connection is back
var wasConnectionLost = false;
//@param isRecordingPossible boolean - Has video loaded on the client
var isRecordingPossible = false;
//@param continueSavingBackup boolean - used to stop saving to the backupArray
//if video is no longer buffered
var continueSavingBackup = true;

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

var calculateScalesOffset = function(offsetToAdd){
    var i = 0;
    for (i; i<scales.length; i++){
        scales[i] += offsetToAdd;
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
    $("#playbutton").mousedown(function(e){
        e.stopPropagation();
        mousedown = !mousedown;
    });
    $("#videoTest").mousedown(function(e){
        e.stopPropagation();
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

//move the cursor with mouse at the center
//@param object JQuery object - cursor container
var moveCursor = function(object){
    var leftObj = object.offset().left;
    var topObj = object.offset().top;
    object.offset({top: topObj,
        left: cursorX - object.width()/2
    });
}

//show the video once loaded with play button
//@param video div - tag containing the video
var onVideoLoaded = function(video){
    var vid = $(video);
    var playbutton = $("#playbutton")
    $(".loading").toggleClass("hidden");
    playbutton.offset({top:vid.offset().top + vid.height()/2 - playbutton.height()/2,
        left: vid.offset().left + vid.width()/2 - playbutton.width()/2
    });
	isRecordingPossible = true;
    return 56; //here we need to implement the duration from the DB, Chrome being
    //unable to retrieve the correct duration from the video tag...
}

//start sending recording datas
//@param video div - tag containing the video
//@param videoLength int - length of the video
var startRecording = function(video, videoLength){
	var intervalID = setInterval(function(){
		if(currentTimeOfTheVideo >= videoLength){
			isEnded = true;
			clearInterval(intervalID);
		}
        //check if we should stop sending data because video has stoped if
        //connection is offline
        video.networkState == 2 ? continueSavingBackup = false: "";
		recordPosition();
		if (isConnected){
			sendOneSecond(currentUserId, currentSecond, currentCursorValue);
		}else{
			wasConnectionLost = true;
			continueSavingBackup ? saveValuesInBackupArray(): "";
		}

	}, INTERVAL_DELTA);
}

//check connection every 100 ms,
//send the backup datas when connection is reestablished
//@param videoLength int - length of the video
var checkDisconnected = function(videoLength){
	var intervalDuringDisconnection = setInterval(function(){
	checkConnection();
	if (isConnected && wasConnectionLost){
		sendBackupArray();
        wasConnectionLost = false;
		//clearInterval(intervalDuringDisconnection);

	} else{
		//console.log("Not connected or connection was not lost");
	}
	if(!wasConnectionLost && currentTimeOfTheVideo >= videoLength){
		isEnded = true;
		clearInterval(intervalDuringDisconnection);
	}
	}, INTERVAL_DELTA/2);
}

//main function to run
//@param video div - tag containing the video
//@param videoLength int - length of the video
var init = function(video, videoLength){
	if (isRecordingPossible){
		video.play();
        $("#playbutton").hasClass("hidden")? "": $("#playbutton").toggleClass("hidden");
		isEnded? "" : startRecording(video, videoLength);
		checkDisconnected(videoLength);
	}
}
