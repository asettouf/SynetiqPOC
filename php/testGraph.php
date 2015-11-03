<?php

//respond to get call to send datas from db (needs an id to retrieve relevant datas)
function main() {
	$url = $_GET["chardata"];
	$videoId = $_GET["videoId"]; //to change with the ajax call
	//echo $url;
	if (isset($url) && isset($videoId) && !empty($videoId)){
		//echo "Yolo";
		$resultArray = retrieveDatasFromDB($videoId);
		echo json_encode($resultArray);
	}
}


//retrieve datas from the db and put them in a suitable format
//@param int videoid - id of the videos for the records taken from the db
//@return array $valueArray - array with values and userid retrieved from the db
function retrieveDatasFromDB($videoId){
    $servername = "localhost";
    $username = "test";
    $password = "Test1234";
    $dbname = "db_test";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn){
		die("connection failed");
	}
	$query = "SELECT Records.userid, value FROM Records WHERE Records.videoid=".$videoId.';';
	$result = $conn -> query($query);
	$valueArray = array();
	$userValues = array();
	$i = 0;
	 if ($result -> num_rows > 0){
		 $allRows = $result -> fetch_all(MYSQLI_ASSOC);
		 //print_r(var_dump($allRows));
        foreach ($allRows as $row){
			$i++;
			$currentUser = $row["userid"];
            array_push($userValues, $row["value"]);
			if ($i < count($allRows)){
				$nextUser = $allRows[$i]["userid"];
				//print_r(var_dump($userValues));
				if (strcmp($currentUser, $nextUser)){
					array_push($valueArray, array("User".$currentUser, $userValues));
					$userValues = array();
				}
			} else{
				array_push($valueArray, array("User".$currentUser, $userValues));
			}
        }
    } else {
        echo "O rows";
    }

	//print_r(var_dump($valueArray));
	$conn -> close();
	return $valueArray;
}



//convertArray(retrieveDatasFromDB(1));
main();
?>
