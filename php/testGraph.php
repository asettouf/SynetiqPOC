<?php
include "DBUtils.php";
//respond to get call to send datas from db (needs an id to retrieve relevant datas)
function sendResultArray() {
	//echo $isRequestingChart;
	if (isset($_GET["chartdata"]) && isset($_GET["videoId"]) && !empty($_GET["videoId"])){
		$videoId = $_GET["videoId"];
		$resultArray = retrieveDatasFromDB($videoId);
		$resultJson = json_encode($resultArray);
		echo $resultJson;
	}

}
function sendVideoLength(){
	if (isset($_GET["videoIdlength"]) && !empty($_GET["videoIdlength"])){
		$length = getVideoLengthFromDB($_GET["videoIdlength"]);
		echo $length;
	}
}
sendVideoLength();
sendResultArray();
?>
