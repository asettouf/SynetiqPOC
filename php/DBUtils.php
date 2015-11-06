<?php
    $servername='';
	$username='';
	$password='';
	$dbname='';
	retrieveDBParams(".dbparams");
	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) {
        die("Connection failed: " . $conn -> connect_error);
    }

	//reads db parameters from file
	//@param string filename - file from which to read db parameters (in order per line
	//servername, username,password, db name
	function retrieveDBParams($filename){
		$dbFile = fopen($filename, "r");
		$GLOBALS["servername"] = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		$GLOBALS["username"] = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		$GLOBALS["password"] = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		$GLOBALS["dbname"] = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		fclose($dbFile);
	}
	//retrieve datas from the db and put them in a suitable format [User, [values]]
	//@param int videoid - id of the videos for the records taken from the db
	//@return array $valueArray - array with values and userid retrieved from the db
	function retrieveDatasFromDB($videoId){
		$query = "SELECT Records.userid, value, second FROM Records WHERE Records.videoid=".$videoId.' ORDER BY userid, second;';
		$result = $GLOBALS["conn"] -> query($query);
		$valueArray = array("user" => array());
		$userValues = array("id" => 0, "values" => array());
		$i = 0;
		 if ($result -> num_rows > 0){
			 $allRows = $result -> fetch_all(MYSQLI_ASSOC);
			 //print_r(var_dump($allRows));
			foreach ($allRows as $row){
				$i++;
				$currentUser = $row["userid"];
                $userValues["id"] = $currentUser;
				array_push($userValues["values"], $row["value"]);
				if ($i < count($allRows)){
					$nextUser = $allRows[$i]["userid"];
					//print_r(var_dump($userValues));
					if (strcmp($currentUser, $nextUser)){
						array_push($valueArray["user"], $userValues);
						$userValues = array("id" => 0, "values" => array());
					}
				} else{
					array_push($valueArray["user"], $userValues);
				}
			}
		} else {
			echo "O rows";
		}
        //print_r(var_dump($valueArray));
		$GLOBALS["conn"]-> close();
		return $valueArray;
	}
    //retrieve video length from DB
    function getVideoLengthFromDB($videoId){
        $query = "SELECT Length FROM Videos WHERE Videos.VideoID=".$videoId.";";
        $result = $GLOBALS["conn"] -> query($query);

        return $result -> fetch_assoc()["Length"];
    }
	//insert records each second into the db
	//The keys in the array are actually the second with the method
	//used in the javascript method
	function createRecordsFromArray($userId, $videoId, $array){

		$statement = $GLOBALS["conn"] -> prepare("INSERT INTO Records(SECOND, VALUE, USERID, VIDEOID) VALUES(?,?,?,?)");
		foreach( $array as $key => $value){
				$statement -> bind_param("iiii",  $key, $value, $userId, $videoId);
				$statement -> execute();
				//echo "Key : ".$key." Value: ".$value;
			}
	}

    //create a record for one second
    function createRecordsForASecond($userId, $videoId, $second, $value){
        $statement = $GLOBALS["conn"] -> prepare("INSERT INTO Records(SECOND, VALUE, USERID, VIDEOID) VALUES(?,?,?,?)");
		$statement -> bind_param("iiii",  $second, $value, $userId, $videoId);
		$statement -> execute();
    }

	//create a new User every time a valid ajax call is received
	function createNewUser($id){
		$stmt = $GLOBALS["conn"] -> prepare("INSERT INTO Users (USERNAME) VALUES(?)");
		$username = "User".$id;

		$stmt -> bind_param("s", $username);
		$stmt -> execute();



	}

	//find the last userid in the table to create a new one for the ajax call
	function findLastIdInTable($table){
		$query = "SELECT * FROM ".$table;

		$result = $GLOBALS["conn"] -> query($query);
		$i = 0;
		if ($result -> num_rows > 0){
			while ($row = $result -> fetch_assoc()){
				$i++;
			}
		}
		return $i;
	}
?>
