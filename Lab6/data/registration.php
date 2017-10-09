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
        $uName = $_POST["uName"];

        $sql = "SELECT username FROM Users WHERE username = '$uName'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            header('HTTP/1.1 409 Conflict, Username already in use please select another one');
            die("Username already in use.");
        }

        else {
            $uPassword = $_POST['uPassword'];
            $fName = $_POST['fName'];
            $lName = $_POST['lName'];
            $uEmail = $_POST['uEmail'];
            $uCountry = $_POST['uCountry'];
            $uGender = $_POST['uGender'];
            
            $sql = "INSERT INTO Users(fName, lName, email, gender, country, username, passwrd) VALUES ('$fName', '$lName', '$uEmail', '$uGender', '$uCountry', '$uName', '$uPassword')";
            
            if (mysqli_query($conn, $sql)) 
            {
                session_start();
                // Store Session Data
                $_SESSION['currentUser']= $uName;

                echo json_encode("New record created successfully");
            } 
            else 
            {
                header('HTTP/1.1 500 Bad connection, something went wrong while saving your data, please try again later');
                die("Error: " . $sql . "\n" . mysqli_error($conn));
            }
        }

    }
?> 

