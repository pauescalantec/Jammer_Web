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

            $sql = "SELECT * FROM Users WHERE username = '$varName'";		
        
            $result = $conn->query($sql);
    
            if ($result->num_rows > 0)
            {
                while ($row = $result->fetch_assoc())
                {
                    $response = array("firstname"=>$row["fName"], "lastname"=>$row["lName"], "email"=>$row["email"], "gender"=>$row["gender"], "country"=>$row["country"], "username"=>$row["username"]);
                }
                
                echo json_encode($response);
            }
    
            else
            {
                header("HTTP/1.1 406 User not found.");
                die("The user was not found.");
            }
        }
    }
?> 

