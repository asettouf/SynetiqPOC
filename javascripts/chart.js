//@author Adonis Settouf <adonis.settouf@gmail.com>

//load the necessary google library to draw a line chart
google.load('visualization', '1.1', {packages: ['line']});

//create the array needed to draw the chart
//@param data google.DataTable - datatable that holds the structure to draw the chart
//@param array datasFromDBForGivenVideo - holds data from the database
var createDataTableFromDBDatas = function(data, datasFromDBForGivenVideo){

	data.addColumn('number', 'Seconds');
	var i = 0;
	for (i; i < datasFromDBForGivenVideo.length; i++){
		data.addColumn("number", datasFromDBForGivenVideo[i][0]);
	}

	var dataArray = [];
	var arrayToPush = [];
	var j = 1;
	console.log(datasFromDBForGivenVideo[0][1]);
	for (j; j < datasFromDBForGivenVideo[0][1].length; j++){
		i = 0;
		arrayToPush.push(j);
		for(i; i <datasFromDBForGivenVideo.length; i++ ){

			arrayToPush.push(parseInt(datasFromDBForGivenVideo[i][1][j]));
		}
		dataArray.push(arrayToPush);
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
	  data = createDataTableFromDBDatas(data, datasFromDBForGivenVideo);
	  var options = {
		chart: {
		  title: 'User rating of the video'
		},
		width: 900,
		height: 500
	  };

	  var chart = new google.charts.Line(document.getElementById('linechart'));

	  chart.draw(data, options);
}


//retrieve datas from the database with an ajax call, then start the drawing once datas
//are loaded from the database
var retrieveDatasInJson = function(){
	$.ajax({
	type: "GET",
	url: "/php/testGraph.php",
	data: {"chardata": "",
			"videoId": 1
	}
	})
	.done(function(data){
		var datasFromDBForGivenVideo = JSON.parse(data);
		drawChart(datasFromDBForGivenVideo);
		//console.log(data);
		console.log("success");
	}).fail(function(error){
		console.log(error);
	});
}
$(document).ready(function(){
	var ready = false;
	//here we need  to load google api and load data from the ajax call
	//so, we set a boolean that indicates the loading of google library is done
	//then we do the ajax call.
	var interval = setInterval(function(){
		if (ready){
			console.log("yolo");
			retrieveDatasInJson();
			clearInterval(interval)
		}

	}, 1000);
	google.setOnLoadCallback(function(){

		ready = true;
	});
});
