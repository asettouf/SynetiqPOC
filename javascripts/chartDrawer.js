//Class to draw the chart
//@param id int - Video id
function Chart(id){
	//@param videoID int - id of the video for which we want to generate a graph
	this.videoId = id;
	//@param phpTarget string - url to hit to retrieve datas from the DB
	this.phpTarget = "../php/graph.php";
	//@param videoLength int - Length of the video in second
	this.videoLength;
	//@param datasFromDBForGivenVideo array - raw datas to parse from DB to provide
	//Google API to draw the chart
	this.datasFromDBForGivenVideo;

	//main loop to draw the graph
	this.init = function(){
		this.retrieveVideoLength();
		this.retrieveDatasInJson();
	}

	//create the data table for google API call
	//@param data google.DataTable - data table that will have the datas for the Google API call
	//@return data google.DataTable - data table filled with datas and average
	this.createDataTableFromDBData = function(data){
		data.addColumn('number', 'Seconds');
		var i = 0;
		for (i; i < this.datasFromDBForGivenVideo.user.length; i++){
			//console.log("User" + datasFromDBForGivenVideo.user[i].id);
			data.addColumn("number", "User" + this.datasFromDBForGivenVideo.user[i].id);
		}
		data.addColumn("number","Average");
		var average = 0;
		var dataArray = [];
		var arrayToPush = [];
		var j = 0;

		for (j; j <= this.videoLength; j++){
			i = 0;
			arrayToPush.push(j);
			for(i; i <this.datasFromDBForGivenVideo.user.length; i++ ){
				//console.log(this.datasFromDBForGivenVideo.user[i]);
				var value = parseInt(this.datasFromDBForGivenVideo.user[i].values[j]);
				arrayToPush.push(isNaN(value) ? null: value);
				average += isNaN(value) ?
							0 : value;
			}
			console.log(average/this.datasFromDBForGivenVideo.user.length);
			arrayToPush.push(average/this.datasFromDBForGivenVideo.user.length);
			dataArray.push(arrayToPush);
			average = 0;
			arrayToPush = [];
		}
		console.log(dataArray);
		data.addRows(dataArray);
		return data;
	}

	//draw the chart with google lib
	this.drawChart = function() {
		console.log("hello");
		  var data = new google.visualization.DataTable();
		  data = this.createDataTableFromDBData(data);
		  var lastSeries = data.getNumberOfColumns() - 2;
		  console.log(lastSeries);
		  var options = {
			title: 'User rating of video ' + this.videoId,
			hAxis: {
	          title: 'Time in second'
	        },
	        vAxis: {
	          title: 'Rating'
	        },
			width: 900,
			height: 500,
			series: {

			},
		  };
		  options["series"][lastSeries] = {
			  color:"black",
			  lineWidth: 5
	  	   };
		   $(".loading").toggleClass("hidden");
		  var chart = new google.visualization.LineChart(document.getElementById('linechart'));

		  chart.draw(data, options);
	}

	//retrieve video length from DB given the id
	this.retrieveVideoLength = function(){
		var that = this;
		$.ajax({
		type: "GET",
		url: this.phpTarget,
		data: {"videoIdlength": this.videoId}
		})
		.done(function(data){
			that.videoLength = data;
		}).error(function(error){
			console.log(error);
		});
	}

	//retrieve datas from the database with an ajax call, then start the drawing once datas
	//are loaded from the database
	this.retrieveDatasInJson  = function(){
		var that = this;
		$.ajax({
		type: "GET",
		url: this.phpTarget,
		data: {"chartdata": "",
				"videoId": this.videoId
		}
		})
		.done(function(data){
			//console.log(data[0]);
			that.datasFromDBForGivenVideo = JSON.parse(data);
			that.drawChart();
			console.log("success");
		}).fail(function(error){
			console.log(error);
		});
	}

}
