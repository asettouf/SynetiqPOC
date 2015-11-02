<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

  </head>
  <body>
<script type="text/javascript" src='http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>
<script type="text/javascript">

//send Data in ajax to be processed by php to record in the database
var sendData = function(){
    //var tmpArray = {0:5, 1:6, 2:7,3:3,4:1};
    var tmpArray = [0,4,3,8,9,3,2];
    $.ajax({
        type: "POST",
        url: "testAjax.php",
        data: "test="+ JSON.stringify(tmpArray),
        dataType: "html"
    })
        .done(function(data){
            console.log(data);
            $("html").html(data);
        }).fail(function(error){
            console.log(error);
        });

}

//sendData();
</script>


<?php

function main(){

    //to DO: add method to read that from cred file
    $servername='localhost';
    $username='root';
    $password='Starkiller00*';
    $db_name='db_test';

    $conn = new mysqli($servername, $username, $password, $db_name);
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
function createRecordsFromArray($userId, $videoId, $array, $conn){

    $statement = $conn -> prepare("INSERT INTO Records(SECOND, VALUE, USERID, VIDEOID) VALUES(?,?,?,?)");
    foreach( $array as $key => $value){
            $statement -> bind_param("iiii",  $key, $value, $userId, $videoId);
            $statement -> execute();
            //echo "Key : ".$key." Value: ".$value;
        }
}

//create a new User every time a valid ajax call is received
function createNewUser($conn, $id){


    $stmt = $conn -> prepare("INSERT INTO Users (USERNAME) VALUES(?)");
    $username = "User".$id;

    $stmt -> bind_param("s", $username);
    $stmt -> execute();



}

//find the last userid in the table to create a new one for the ajax call
function findLastIdInTable($connection, $table){
    $query = "SELECT * FROM ".$table;
    $result = $connection -> query($query);
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
</body>
</html>
