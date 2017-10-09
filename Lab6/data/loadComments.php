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
            $varName = $_SESSION["currentUser"];

            $sql = "SELECT * 
                    FROM Notes 
                    WHERE noteKey IN (
                        SELECT Posts.noteKey
                        FROM Users, Posts
                        WHERE Users.username = '$varName'
                        AND Posts.username =  '$varName'
                    )";		

            $result = $conn->query($sql);

            if ($result->num_rows > 0)
            {
                $counter = 0;

                while ($row = $result->fetch_assoc())
                {
                    $response[$counter++] = array("note"=>$row["noteContent"], "owner"=>$row["ownerName"]);
                }
            
                echo json_encode($response);
            }

            else
            {
                header("HTTP/1.1 406 Comments not found.");
                die("User has no comments/notes registered.");
            }

        }
    }
?> 

