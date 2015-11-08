<?php
include "DBUtils.php";
$DButil = new DBUtils();
//respond to get call to send datas from db (needs an id to retrieve relevant datas)
function sendResultArray($DBUtil) {
	//echo $isRequestingChart;
	if (isset($_GET["chartdata"]) && isset($_GET["videoId"]) && !empty($_GET["videoId"])){
		$videoId = $_GET["videoId"];
		$resultArray = $DBUtil -> retrieveDatasFromDB($videoId);
		$resultJson = json_encode($resultArray);
		echo $resultJson;
	}

}
//retrieve the video length to send to ajax call to adjust x-axis of the chart
function sendVideoLength($DBUtil){
	if (isset($_GET["videoIdlength"]) && !empty($_GET["videoIdlength"])){
		$length = $DBUtil -> getVideoLengthFromDB($_GET["videoIdlength"]);
		echo $length;
	}
}
sendVideoLength($DButil);
sendResultArray($DButil);
?>
