<?php 
    header('Accept: application/json');
    header('Content-type: application/json');

    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "jammerDB"; 

    $conn = new mysqli($servername, $username, $password, $dbname);

    if($conn->connect_error)
    {
        // 500 Error when server is down
        header("HTTP/1.1 500 Bad connection: database down");
        die("Database down, could not establish connection");
    }

    else {
        $varName = $_POST["uName"];
        $varPassword = $_POST["uPassword"];

        $sql = "SELECT * FROM Users WHERE username = '$varName' AND passwrd = '$varPassword'";		

        $result = $conn->query($sql);

        if ($result->num_rows > 0)
        {
            while ($row = $result->fetch_assoc())
            {
                $response = array("firstname"=>$row["fName"], "lastname"=>$row["lName"]);
            }

            // Store Session Data
            session_start();
            
            $_SESSION['currentUser']= $varName;
            $_SESSION['fName'] = $response['firstname'];
            $_SESSION['lName'] = $response['lastname'];

            if($_POST["checkbox"] == "on"){
                // Store cookie data
                $cookie_name = "savedUser";
                $cookie_value = $varName;
                setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
            }

            echo json_encode($response);
        }

        else
        {
            header("HTTP/1.1 406 User not found.");
            die("The username and password you entered did not match our records.");
        }
    }
?> 

