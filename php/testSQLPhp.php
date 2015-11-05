<?php
    $tt = array("user" => array("id" => 1, "Values" => array(0), "Second" => array(1)));
    //array_push($tt, array("User2", array_reverse($tt[0][1])));
    //array_push($tt["Values"], 1);
    //array_push($tt["Second"], 2);
    //echo $tt["Values"][0];
    //print_r(var_dump($tt));
    $ee = json_encode($tt);
    echo $ee;
?>
<script type="text/javascript" src='http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>

<script>
    var dd= "";
    $.ajax({
    type: "GET",
    url: "../php/testSQLPhp.php"
    }).done(function(data){
        dd = data.split("<")[0];
        console.log(data)
        console.log(JSON.parse(dd));
    }).fail(function(error){
        console.log(error);
    });
</script>
