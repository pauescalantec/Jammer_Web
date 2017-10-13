<?php 
    header('Accept: application/json');
    header('Content-type: application/json');

    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "jammerDB"; 

    session_start();

    $conn = new mysqli($servername, $username, $password, $dbname);

    if($conn->connect_error)
    {
        // 500 Error when server is down
        header("HTTP/1.1 500 Bad connection: database down");
        die("Database down, could not establish connection");
    }

    else {
        if( isset($_SESSION["currentUser"])) {
            $dbKey = $_POST["dbKey"];
            $text = $_POST["text"];
            $varName = $_SESSION["currentUser"];

            $sql1 = "INSERT INTO Notes(noteContent, noteKey, ownerName) VALUES('$text', '$dbKey', '$varName')";

            $sql2 = "INSERT INTO Posts(username, noteKey) VALUES('$varName', '$dbKey')";
            
            if (mysqli_query($conn, $sql1) && mysqli_query($conn, $sql2)) 
            {
                echo json_encode("New comment created successfully");
            } 
            else
            {
                header("HTTP/1.1 406 Comments not found.");
                die("Comment not registered.");
            }

        }
    }
