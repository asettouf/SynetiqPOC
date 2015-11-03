google.load('visualization', '1.1', {packages: ['line']});
var datasFromDBForGivenVideo = [];

var createDataTableFromDBDatas = function(data){

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

var drawChart = function() {
	console.log("hello");
	  var data = new google.visualization.DataTable();
	  data = createDataTableFromDBDatas(data);
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



var retrieveDatasInJson = function(){
	$.ajax({
	type: "GET",
	url: "/php/testGraph.php",
	data: {"chardata": "",
			"videoId": 1
	}
	})
	.done(function(data){
		datasFromDBForGivenVideo = JSON.parse(data);
		drawChart();
		//console.log(data);
		console.log("success");
	}).fail(function(error){
		console.log(error);
	});
}
$(document).ready(function(){
	var ready = false;
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
