function Chart(id){

	this.videoId = id;
	this.phpTarget = "/php/graph.php";
	this.videoLength;
	this.datasFromDBForGivenVideo;
	//create the array needed to draw the chart
	//@param data google.DataTable - datatable that holds the structure to draw the chart
	//@param array datasFromDBForGivenVideo - holds data from the database

	this.init = function(){
		this.retrieveVideoLength();
		this.retrieveDatasInJson();
	}
	this.createDataTableFromDBData = function(data){
		data.addColumn('number', 'Seconds');
		var i = 0;
		for (i; i < this.datasFromDBForGivenVideo.user.length; i++){
			//console.log("User" + datasFromDBForGivenVideo.user[i].id);
			data.addColumn("number", "User" + this.datasFromDBForGivenVideo.user[i].id);
		}
		data.addColumn("number","Average");
		//data.addColumn({"id": "", "type":"number", "label":"Average", "role": "style, color: black; stroke-width:2;"});
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

		  var chart = new google.visualization.LineChart(document.getElementById('linechart'));

		  chart.draw(data, options);
	}

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
