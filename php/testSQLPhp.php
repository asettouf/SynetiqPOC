<?php

function main(){
    $servername = "localhost";
    $username = "test";
    $password = "Test1234";
    $dbname = "db_test";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if (!$conn) {
        die("Connection failed: " . $conn -> connect_error);
    }
    echo "Before INSERT\n";

    showTable($conn, "Videos");

    $statement = $conn -> prepare("INSERT INTO Videos (VIDEONAME, LENGTH)
    VALUES (?,?)");
    $statement -> bind_param("si", $name, $length);

    $name = "Go Go Go";
    $length = 666;
    $statement -> execute();

    $name = "Super test";
    $length = 222;
    $statement -> execute();

    echo "After INSERT\n";

    showTable($conn, "Videos");

    $conn -> close();
}

function showTable($connection, $table){
    $query = "SELECT * FROM ".$table;
    $result = $connection -> query($query);

    if ($result -> num_rows > 0){
        while ($row = $result -> fetch_assoc()){
            foreach($row as $key => $value){
                echo $key." has value = ".$value."\n";
            }
        }
    } else {
        echo "O rows";
    }
}

main();
 ?>
