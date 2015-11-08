<?php

class DBUtils{
    //@param servername string - hostname of the server
    private $servername;
    //@param username string -username with rights on the DB
	private $username;
    //@param password string - password of the username with rights on the DB
	private $password;
    //@param dbname string - name of the DB used
	private $dbname;
    //@param conn mysqli object -connection to the DB
    private $conn;

    public function DBUtils(){
        $this -> retrieveDBParams(".dbparams");
    	$this -> conn = new mysqli($this -> servername, $this -> username, $this -> password, $this -> dbname);
        //$this -> conn = new mysqli(null, 'synetiq', 'Synetiq1234', 'synetiq', '/cloudsql/synetiqpoc:synetiq');
    	if (!$this -> conn) {
            die("Connection failed: " . $conn -> connect_error);
        }
    }
	//reads db parameters from file
	//@param string filename - file from which to read db parameters (in order per line
	//servername, username,password, db name
	public function retrieveDBParams($filename){
		$dbFile = fopen($filename, "r");
		$this -> servername = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		$this -> username = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		$this -> password = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		$this -> dbname = feof($dbFile) ? "" : rtrim(fgets($dbFile), "\r\n");
		fclose($dbFile);
	}
	//retrieve datas from the db and put them in a suitable format [User, [values]]
	//@param int videoid - id of the videos for the records taken from the db
	//@return array $valueArray - array with values and userid retrieved from the db
	public function retrieveDatasFromDB($videoId){
		$query = "SELECT Records.userid, value, second FROM Records WHERE Records.videoid=".$videoId.' ORDER BY userid, second;';
		$result = $this -> conn -> query($query);
		$valueArray = array("user" => array());
		$userValues = array("id" => 0, "values" => array());
		$i = 0;
		 if ($result -> num_rows > 0){
			 //$allRows = $result -> fetch_all(MYSQLI_ASSOC);
			 //print_r(var_dump($allRows));
			while($row = $result -> fetch_assoc()){
                if($i != 0){
                    if (strcmp($previousUser, $row["userid"])){
                        array_push($valueArray["user"], $userValues);
                        $userValues = array("id" => 0, "values" => array());
                    } else{
                        array_push($userValues["values"], $row["value"]);
                        //array_push($valueArray["user"], $userValues);
                    }
                }
				$previousUser = $row["userid"];
                $i++;
                $userValues["id"] = $previousUser;

			}
            array_push($valueArray["user"], $userValues);
		} else {
			echo "O rows";
		}
        //print_r(var_dump($valueArray));
		$this -> conn-> close();
		return $valueArray;
	}
    //retrieve video length from DB
    //@param videoId int - ID of the video
    public function getVideoLengthFromDB($videoId){
        $query = "SELECT Length FROM Videos WHERE Videos.VideoID=".$videoId.";";
        $result = $this -> conn -> query($query);

        return $result -> fetch_assoc()["Length"];
    }

    //create a record for one second
    //@param userId int - ID of the user
    //@param videoId int - ID of the video
    //@param second int - second of the record
    //@param value int - value of the record
    public function createRecordsForASecond($userId, $videoId, $second, $value){
        $statement = $this -> conn -> prepare("INSERT INTO Records(SECOND, VALUE, USERID, VIDEOID) VALUES(?,?,?,?)");
		$statement -> bind_param("iiii",  $second, $value, $userId, $videoId);
		$statement -> execute();
        $this -> conn -> close();
    }

	//create a new User every time a valid ajax call is received
    //@param userId int - ID of the user
	public function createNewUser($id){
		$stmt = $this -> conn -> prepare("INSERT INTO Users (USERNAME) VALUES(?)");
		$username = "User".$id;
		$stmt -> bind_param("s", $username);
		$stmt -> execute();
        $this -> conn -> close();
	}

	//find the last userid in the table to create a new one for the ajax call
    //@param table string - name of the table to look up
	public function findLastIdInTable($table){
		$query = "SELECT * FROM ".$table;
		$result = $this -> conn -> query($query);
		$i = 0;
		if ($result -> num_rows > 0){
			while ($row = $result -> fetch_assoc()){
				$i++;
			}
		}
		return $i;
	}
}
?>
