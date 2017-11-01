<?php

	function databaseConnection(){
		$servername = "localhost";
		$username = "root";
		$password = "root";
		$dbname = "jammerDB"; 

		$conn = new mysqli($servername, $username, $password, $dbname);

		if ($conn->connect_error)
		{
			return null;
		}
		else
		{
			return $conn;
		}
	}

	function dataPostComment($uName, $dbKey, $text){
		$connection = databaseConnection();
		
		if ($connection != null){
			$sql1 = "INSERT INTO Notes(noteContent, noteKey, ownerName) VALUES('$text', '$dbKey', '$uName')";
			
			$sql2 = "INSERT INTO Posts(username, noteKey) VALUES('$uName', '$dbKey')";
			
			if (mysqli_query($connection, $sql1) && mysqli_query($connection, $sql2)) {
				return array("MESSAGE"=>"SUCCESS");
			} 
			else{
				return array("MESSAGE"=>"406");
			}
		}

		else{
			return array("MESSAGE"=>"500");
		}

	}

	function dataAcceptRequest($friendName, $uName){
		$connection = databaseConnection();
		
		if ($connection != null){
			$sql1 = "UPDATE Friendships SET status = 'F' WHERE friend1 = '$friendName' AND friend2 = '$uName'";
			
			$sql2 = "INSERT INTO Friendships(status, friend1, friend2) VALUES ('F', '$uName', '$friendName')";
			
			if (mysqli_query($connection, $sql1) && mysqli_query($connection, $sql2)) {
				return array("MESSAGE"=>"SUCCESS");
			} 
			else{
				return array("MESSAGE"=>"406");
			}
		}

		else{
			return array("MESSAGE"=>"500");
		}

	}

	function dataRejectRequest($friendName, $uName){
		$connection = databaseConnection();
		
		if ($connection != null){
			$sql = "DELETE FROM Friendships WHERE friend1 = '$friendName' AND friend2 = '$uName'";
						
			if ($connection->query($sql) === TRUE) {
				return array("MESSAGE"=>"SUCCESS");
			} 
			else{
				return array("MESSAGE"=>"406");
			}
		}

		else{
			return array("MESSAGE"=>"500");
		}

	}

	function dataLoadProfile($uName){
		$connection = databaseConnection();
		
		if ($connection != null){
			
			$sql = "SELECT * FROM Users WHERE username = '$uName'";		
			
			$result = $connection->query($sql);
	
			if ($result->num_rows > 0)
			{
				while ($row = $result->fetch_assoc())
				{
					$response = array("firstname"=>$row["fName"], "lastname"=>$row["lName"], "email"=>$row["email"], "gender"=>$row["gender"], "country"=>$row["country"], "username"=>$row["username"]);
				}
				$connection->close();
                return array("response"=>$response, "MESSAGE"=>"SUCCESS");
			}
	
			else
			{
				return array("MESSAGE"=>"406");
			}

		}
		else{
			return array("MESSAGE"=>"500");
		}
	}

	function dataLoadFriends($uName){
		$connection = databaseConnection();
		
		if ($connection != null){
			$sql = "SELECT username, fName, lName, email
					FROM Users 
					WHERE username IN ((SELECT friend2
										FROM Friendships
										WHERE friend1 = '$uName'
										AND status = 'F'))";	

			$result = $connection->query($sql);

			if ($result->num_rows > 0)
			{
				$counter = 0;

				while ($row = $result->fetch_assoc())
				{
					$fullName = $row["fName"] . " " . $row["lName"];
					$response[$counter++] = array("username"=>$row["username"], "fullName"=>$fullName, "email"=>$row["email"]);
				}

				$connection->close();
				return array("response"=>$response, "MESSAGE"=>"SUCCESS");
			}

			else
			{
				$connection->close();
				return array("MESSAGE"=>"204");
			}
		}
		else{
			return array("MESSAGE"=>"500");
		}
	}

	function dataLoadRequests($uName){
		$connection = databaseConnection();
		
		if ($connection != null){
			$sql = "SELECT username, fName, lName, email
					FROM Users 
					WHERE username IN ((SELECT friend1
										FROM Friendships
										WHERE friend2 = '$uName'
										AND status = 'P'))";	

			$result = $connection->query($sql);

			if ($result->num_rows > 0)
			{
				$counter = 0;

				while ($row = $result->fetch_assoc())
				{
					$fullName = $row["fName"] . " " . $row["lName"];
					$response[$counter++] =  array("username"=>$row["username"], "fullName"=>$fullName, "email"=>$row["email"]);
				}

				$connection->close();
				return array("response"=>$response, "MESSAGE"=>"SUCCESS");
			}

			else
			{
				$connection->close();
				return array("MESSAGE"=>"204");
			}
		}
		else{
			return array("MESSAGE"=>"500");
		}
	}

	function dataSendRequest($friendName, $uName){
		$connection = databaseConnection();
		
		if ($connection != null){
			$sql = "INSERT INTO Friendships(status, friend1, friend2) VALUES ('P', '$uName', '$friendName')";
			
			if (mysqli_query($connection, $sql)) {
				return array("MESSAGE"=>"SUCCESS");
			} 
			else{
				return array("MESSAGE"=>"406");
			}
		}

		else{
			return array("MESSAGE"=>"500");
		}

	}

	function dataSearch($uName, $searchField){
		$connection = databaseConnection();
		
		if ($connection != null){
			$field = "%" . $searchField . "%";

			$sql = "SELECT username, fName, lName, email
					FROM Users 
					WHERE (username LIKE '$field' OR email LIKE '$field') 
					AND username NOT IN (SELECT friend2 FROM Friendships WHERE friend1 = '$uName')
					AND username NOT IN (SELECT friend1 FROM Friendships WHERE friend2 = '$uName')
					AND username != '$uName'";	

			$result = $connection->query($sql);

			if ($result->num_rows > 0)
			{
				$counter = 0;

				while ($row = $result->fetch_assoc())
				{
					$fullName = $row["fName"] . " " . $row["lName"];
					$response[$counter++] = array("username"=>$row["username"], "fullName"=>$fullName, "email"=>$row["email"]);
				}

				$connection->close();
				return array("response"=>$response, "MESSAGE"=>"SUCCESS");
			}

			else
			{
				$connection->close();
				return array("MESSAGE"=>"204");
			}
		}
		else{
			return array("MESSAGE"=>"500");
		}
	}

	function dataCountRequests($uName){
		$connection = databaseConnection();
		
		if ($connection != null){
			$sql = "SELECT COUNT(username) as total
					FROM Users 
					WHERE username IN ((SELECT friend1
										FROM Friendships
										WHERE friend2 = '$uName'
										AND status = 'P'))";	

			$result = $connection->query($sql);

			if ($result->num_rows > 0)
			{
				$counter = 0;

				while ($row = $result->fetch_assoc())
				{
					$response = array("count"=>$row["total"]);
				}

				$connection->close();
				return array("response"=>$response, "MESSAGE"=>"SUCCESS");
			}

			else
			{
				$connection->close();
				return array("MESSAGE"=>"204");
			}
		}
		else{
			return array("MESSAGE"=>"500");
		}
	}

	function dataLoadComments($uName){
		$connection = databaseConnection();

		if ($connection != null){
			$sql = "SELECT * 
                    FROM Notes 
                    WHERE noteKey IN (
                        SELECT Posts.noteKey
                        FROM Users, Posts
                        WHERE Users.username = '$uName'
                        AND Posts.username =  '$uName'
					)";	

			$result = $connection->query($sql);

			if ($result->num_rows > 0)
            {
                $counter = 0;

                while ($row = $result->fetch_assoc())
                {
                    $response[$counter++] = array("note"=>$row["noteContent"], "owner"=>$row["ownerName"]);
				}

				$connection->close();
                return array("comments"=>$response, "MESSAGE"=>"SUCCESS");
            }

            else
            {
				$connection->close();
                return array("MESSAGE"=>"204");
            }
		}
		else{
			return array("MESSAGE"=>"500");
		}
	}

	function dataRegister($uName, $uPassword, $fName, $lName, $uEmail, $uCountry, $uGender){
		if (userNotExists($uName)){
			$connection = databaseConnection();
			
			if ($connection != null){ 
				$sql = "INSERT INTO Users(fName, lName, email, gender, country, username, passwrd) VALUES ('$fName', '$lName', '$uEmail', '$uGender', '$uCountry', '$uName', '$uPassword')";
				
				if (mysqli_query($conn, $sql)) {
					$response = array("firstname"=>$row["fName"], "lastname"=>$row["lName"], "MESSAGE"=>"SUCCESS");
					$connection->close();
					return $response;
				}

				else{
					$connection->close();
					return array("MESSAGE"=>"406");
				}
			
			}
			else{
				return array("MESSAGE"=>"500");
			}
		}

		else{
			return array("MESSAGE"=>"409");
		}

	}

	function userNotExists($uName){
		$connection = databaseConnection();

		if ($connection != null){ 
			$sql = "SELECT username FROM Users WHERE username = '$uName'";
			$result = $connection->query($sql);

			if ($result->num_rows > 0){
				return false;
			}
		}

		$connection->close();
		return true;
	}

	function dataLogin($uName, $varPassword){
		$connection = databaseConnection();

		if ($connection != null){
			$sql = "SELECT * FROM Users WHERE username = '$uName' AND passwrd = '$varPassword'";

			$result = $connection->query($sql);

			if ($result->num_rows > 0){
				while ($row = $result->fetch_assoc()){
					$response = array("firstname"=>$row["fName"], "lastname"=>$row["lName"], "MESSAGE"=>"SUCCESS");
				}		

				$connection->close();
				return $response;
			}
			else{
				$connection->close();
				return array("MESSAGE"=>"406");
			}
		}
		else{
			return array("MESSAGE"=>"500");
		}

	}

?>
