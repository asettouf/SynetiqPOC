//@author Adonis Settouf <adonis.settouf@gmail.com>


//@param INTERVAL_DELTA int - set the delta of execution of the setInterval used
//for recording
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
var timeWhenVideoEnds = 0;
//@param isEnded boolean - Checks if video ended
var isEnded = false;
//@param currentTimeOfTheVideo int - current time in the video in seconds
var currentTimeOfTheVideo = 0;
//@param isConnected boolean - Switch to false if connection is interrupted
var isConnected = true;
//@param backupArray array - Array stored in local storage in case of connection failure
var backupArray = {};
//@param phpTarget string - url to hit to retrieve to send datas to the DB
var phpTarget = "/php/sendDataToDB.php";
//@param videoId int - id of the video for which we send the datas
var videoId = 1;

$(document).ready(function(){
    main();
});

//to be run once document is ready
var main = function(){
    drawScale("scale", 10);
    drawCursor("cursor");
    moveObject("scale");
    calculateScalesOffset($("#scale").offset().left);
	retrieveUserId();
    initializeEventListener();
}

//start event listener to have full functionality when starting the video
var initializeEventListener = function(){
    var videoLength = 0;
    var playbutton = $("#playbutton");
	var video = $("#videoTest")[0];
    //console.log(video.readyState);
	//For Chrome to have the onVideoLoaded executed
	video.addEventListener("canplaythrough", function(){
		videoLength = onVideoLoaded(video);
	});
    //For Firefox to have the onVideoLoaded executed
	if(video.readyState > 2) {
        videoLength = onVideoLoaded(video);
	}
    video.addEventListener("click", function(e){
        e.stopPropagation();
        init(video, videoLength);
    })
	playbutton.on("click", function(e){
        e.stopPropagation();
		init(video, videoLength);
	});
}

//check if user is still connected
var checkConnection = function(){
	$.ajax({
	type: "GET",
	url: phpTarget,
	data: "isConnected"
	})
	.done(function(data){
        isConnected = true;
    }).error(function(error){
        isConnected = false;
    });
}

//save the backup array to local storage
var saveValuesInBackupArray = function(){
	backupArray = JSON.parse(localStorage.getItem("backupArray"));
	backupArray.currentUserValues.push({"Second" : currentSecond,
	"Value" : currentCursorValue});
	localStorage.setItem("backupArray", JSON.stringify(backupArray));
}

//send the backup array
var sendBackupArray = function(){
	backupArray = JSON.parse(localStorage.getItem("backupArray"));
	console.log(backupArray);
	var i = 0;
	for (i; i< backupArray.currentUserValues.length; i++){
		sendOneSecond(currentUserId,backupArray.currentUserValues[i].Second,
            backupArray.currentUserValues[i].Value);
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
	url: phpTarget,
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
//@param userId int - user for the current video
//@param second int - second for the current value sent
//@param value int - value for the current second
var sendOneSecond = function(userId, second, value){
    $.ajax({
        type: "POST",
        url: phpTarget,
        data: {"uid" : userId,
                "second" : second,
                "value" : value,
                "videoId": videoId
        }
    })
	.done(function(data){
		//console.log(data);
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
