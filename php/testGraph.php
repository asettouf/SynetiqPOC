<?php
include "DBUtils.php";
//respond to get call to send datas from db (needs an id to retrieve relevant datas)
function main() {
	$url = $_GET["chartdata"];
	$videoId = $_GET["videoId"]; //to change with the ajax call
	echo $url;
	if (isset($url) && isset($videoId) && !empty($videoId)){
		$resultArray = retrieveDatasFromDB($videoId);
		echo json_encode($resultArray);
	}
	$GLOBALS["conn"]-> close();
}
main();
?>
