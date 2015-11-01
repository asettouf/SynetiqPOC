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
    var tmpArray = {0:5, 1:6, 2:7,3:3,4:1};
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
    $url = $_REQUEST['test'];
    if (isset($url) && !empty($url)){
        //echo $url;
        $tt = json_decode($url);
        foreach( $tt as $key => $value){
            echo "Key : ".$key." Value: ".$value;
        }
    }


}

main();
 ?>
</body>
</html>
