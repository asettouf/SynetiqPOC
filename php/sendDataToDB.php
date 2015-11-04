<?php
include "DBUtils.php";
function sendUserId(){
    $url = $_GET["uid"];
    if( isset($url)){
        $id = findLastIdInTable("Users");
        $id++;
        createNewUser($id);
        echo $id;
    }

}
function postOneSecond(){
    $second = $_POST["second"];
    $value = $_POST["value"];
    $userId = $_POST["uid"];
    if (isset($second)  && isset($value) && !empty($value) && isset($userId) && !empty($userId)){
        echo $second;
        createRecordsForASecond($userId, 1, $second, $value, $GLOBALS["conn"]);
    }
    $GLOBALS["conn"] -> close();
}
sendUserId();
postOneSecond();
 ?>
