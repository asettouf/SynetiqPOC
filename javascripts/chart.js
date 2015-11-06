//@author Adonis Settouf <adonis.settouf@gmail.com>

//load the necessary google library to draw a line chart
google.load('visualization', '1.1', {packages: ['line']});
var videoId = 1;
var phpTarget = "../php/testGraph.php";

var videoLength = 0;
//create the array needed to draw the chart
//@param data google.DataTable - datatable that holds the structure to draw the chart
//@param array datasFromDBForGivenVideo - holds data from the database
var createDataTableFromDBDatas = function(data, datasFromDBForGivenVideo){
	data.addColumn('number', 'Seconds');
	var i = 0;
	for (i; i < datasFromDBForGivenVideo.user.length; i++){
		//console.log("User" + datasFromDBForGivenVideo.user[i].id);
		data.addColumn("number", "User" + datasFromDBForGivenVideo.user[i].id);
	}
	data.addColumn("number","Average");
	//data.addColumn({"id": "", "type":"number", "label":"Average", "role": "style, color: black; stroke-width:2;"});
	var average = 0;
	var dataArray = [];
	var arrayToPush = [];
	var j = 0;
	console.log(videoLength);
	for (j; j < videoLength; j++){
		i = 0;
		arrayToPush.push(j);
		for(i; i <datasFromDBForGivenVideo.user.length; i++ ){
			//console.log(datasFromDBForGivenVideo.user[i]);
			var value = parseInt(datasFromDBForGivenVideo.user[i].values[j]);
			arrayToPush.push(isNaN(value) ? null: value);
			average += isNaN(value) ?
						0 : value;
		}
		console.log(average/datasFromDBForGivenVideo.user.length);
		arrayToPush.push(average/datasFromDBForGivenVideo.user.length);
		dataArray.push(arrayToPush);
		average = 0;
		arrayToPush = [];
	}
	console.log(dataArray);
	data.addRows(dataArray);
	return data;
}

//draw the chart with google lib
var drawChart = function(datasFromDBForGivenVideo) {
	console.log("hello");
	  var data = new google.visualization.DataTable();
	  var lastSeries = datasFromDBForGivenVideo.user.length - 1;
	  data = createDataTableFromDBDatas(data, datasFromDBForGivenVideo);
	  var options = {
		chart: {
		  title: 'User rating of video ' + videoId
		},
		width: 900,
		height: 500,
		series: {
			1:{
				color: "black",
				strokeWidth: 5
			}
		}			
	  };

	  var chart = new google.charts.Line(document.getElementById('linechart'));

	  chart.draw(data, options);
}

var retrieveVideoLength = function(){
	$.ajax({
	type: "GET",
	url: phpTarget,
	data: {"videoIdlength": videoId}
	})
	.done(function(data){
		videoLength = data;
	}).error(function(error){
		console.log(error);
	});
}

//retrieve datas from the database with an ajax call, then start the drawing once datas
//are loaded from the database
var retrieveDatasInJson = function(){
	$.ajax({
	type: "GET",
	url: phpTarget,
	data: {"chartdata": "",
			"videoId": videoId
	}
	})
	.done(function(data){
		//console.log(data[0]);
		var datasFromDBForGivenVideo = JSON.parse(data);
		drawChart(datasFromDBForGivenVideo);
		console.log("success");
	}).fail(function(error){
		console.log(error);
	});
}
$(document).ready(function(){
	var ready = false;
	retrieveVideoLength();
	//here we need  to load google api and load data from the ajax call
	//so, we set a boolean that indicates the loading of google library is done
	//then we do the ajax call.
	var interval = setInterval(function(){
		if (ready){
			retrieveDatasInJson();
			clearInterval(interval)
		}

	}, 1000);
	google.setOnLoadCallback(function(){

		ready = true;
	});
});
