<?php
include "DBUtils.php";
function sendUserId(){
    if( isset($_GET["uid"])){
        $id = findLastIdInTable("Users");
        $id++;
        createNewUser($id);
        echo $id;
    }

}
function postOneSecond(){
    if (isset($_POST["second"])  && isset($_POST["value"]) && !empty($_POST["value"]) && isset($_POST["uid"]) && !empty($_POST["uid"])){
        $second = $_POST["second"];
        $value = $_POST["value"];
        $userId = $_POST["uid"];
        createRecordsForASecond($userId, 1, $second, $value, $GLOBALS["conn"]);
    }
    $GLOBALS["conn"] -> close();
}
sendUserId();
postOneSecond();
 ?>
