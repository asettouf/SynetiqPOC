<?php

//@author Adonis Settouf <adonis.settouf@gmail.com>

function main(){

    //to DO: add method to read that from cred file
    $servername = "localhost";
    $username = "test";
    $password = "Test1234";
    $dbname = "db_test";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if (!$conn) {
        die("Connection failed: " . $conn -> connect_error);
    }
    $url = $_POST["test"];
    if (isset($url) && !empty($url)){
        //echo $url;
        $id = findLastIdInTable($conn, "Users");
        $id++;
        createNewUser($conn, $id);
        $array = json_decode($url);
        createRecordsFromArray($id, 1, $array, $conn);

    }
    $conn -> close();
}

//insert records each second into the db
//The keys in the array are actually the second with the method
//used in the javascript method
//@param int $userId - Id of the user which records are saved
//@param int $videoId - Id of the video for which records are saved
//@ param array $array - Array containing the values, the keys being the seconds
//@param mysqli object $conn - Connection to the SQL database
function createRecordsFromArray($userId, $videoId, $array, $conn){

    $statement = $conn -> prepare("INSERT INTO Records(SECOND, VALUE, USERID, VIDEOID) VALUES(?,?,?,?)");
    foreach( $array as $key => $value){
            $statement -> bind_param("iiii",  $key, $value, $userId, $videoId);
            $statement -> execute();
            //echo "Key : ".$key." Value: ".$value;
        }
}

//create a new User every time a valid ajax call is received
//@param mysqli object $conn - Connection to the SQL database
//@param int $id - id of the user created
function createNewUser($conn, $id){


    $stmt = $conn -> prepare("INSERT INTO Users (USERNAME) VALUES(?)");
    $username = "User".$id;

    $stmt -> bind_param("s", $username);
    $stmt -> execute();



}

//find the last id in the table to create a new one for the ajax call
//@param mysqli object $conn - Connection to the SQL database
//@param string $table - table name for which we want to retrieve the last id
function findLastIdInTable($conn, $table){
    $query = "SELECT * FROM ".$table;
    $result = $conn -> query($query);
    $i = 0;
    if ($result -> num_rows > 0){
        while ($row = $result -> fetch_assoc()){
            $i++;
        }
    }
    return $i;
}

main();
 ?>
