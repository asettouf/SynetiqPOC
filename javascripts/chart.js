//@author Adonis Settouf <adonis.settouf@gmail.com>

//load the necessary google library to draw a line chart
google.load('visualization', '1.1', {packages: ['corechart']});

$(document).ready(function(){
	var ready = false;
	var chart = new Chart(1);
	//here we need  to load google api and load data from the ajax call
	//so, we set a boolean that indicates the loading of google library is done
	//then we do the ajax call.
	var interval = setInterval(function(){
		if (ready){
			chart.init();
			clearInterval(interval);
		}

	}, 1000);
	google.setOnLoadCallback(function(){

		ready = true;
	});
});
