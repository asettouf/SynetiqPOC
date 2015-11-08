<?php
include "DBUtils.php";
$DBUtil = new DButils();
if (!isset($DBUtil)){
    echo "Nique ta mere";
}
/*
*Create a new user in the database and send the id to a get request
*@param DBUtil DButils object - handle operations with the database
*/
function sendUserId($DBUtil){
    if( isset($_GET["uid"])){
        $id = $DBUtil -> findLastIdInTable("Users");
        $id++;
        $DBUtil -> createNewUser($id);
        echo $id;
    }

}
/*
*Record one second of data in the database
*@param DBUtil DButils object - handle operations with the database
*/
function postOneSecond($DBUtil){
    if (isset($_POST["second"]) &&isset($_POST["videoId"]) &&
!empty($_POST["videoId"]) && isset($_POST["value"]) && !empty($_POST["value"]) &&
isset($_POST["uid"]) && !empty($_POST["uid"])){
        $second = $_POST["second"];
        $value = $_POST["value"];
        $userId = $_POST["uid"];
        $videoId = $_POST["videoId"];
        $DBUtil -> createRecordsForASecond($userId, $videoId, $second, $value);
    }
}
sendUserId($DBUtil);
postOneSecond($DBUtil);
 ?>
