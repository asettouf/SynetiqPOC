google.load('visualization', '1.1', {packages: ['line']});
var datasFromDBForGivenVideo = [];

var drawChart = function() {
	  retrieveDatasInJson();
	  var data = new google.visualization.DataTable();
	  data.addColumn('number', 'Seconds');
	  data.addColumn('number', datasFromDBForGivenVideo[0][0]);
	  data.addColumn('number', datasFromDBForGivenVideo[1][0]);

	  data.addRows([
		[1,  37.8],
		[2,  30.9, 69.5],
		[3,  25.4,   57],
		[4,  11.7, 18.8],
		[5,  11.9, 17.6],
		[6,   8.8, 13.6],
		[7,   7.6, 12.3],
		[8,  12.3, 29.2],
		[9,  16.9, 42.9],
		[10, 12.8, 30.9],
		[11,  5.3,  7.9],
		[12,  6.6,  8.4],
		[13,  4.8,  6.3],
		[14,  4.2,  6.2]
	  ]);

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
		console.log(data);
		console.log("success");
	}).fail(function(error){
		console.log(error);
	});

}
$(document).ready(function(){

	google.setOnLoadCallback(drawChart);
	});
