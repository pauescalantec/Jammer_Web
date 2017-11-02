<?php
	header('Content-type: application/json');
	header('Accept: application/json');
	require_once __DIR__ . '/dataLayer.php';
	require_once __DIR__ . '/defuse-crypto.phar';

	$action = $_POST["action"];

	switch($action)
	{
		case "LOGIN" : loginFunction();
						break;
		case "ELOGIN" : encryptedLoginFunction();
						break;	
		case "REGISTRATION" : registrationFunction();
						break;
		case "EREGISTRATION" : encryptedRegistrationFunction();
						break;
		case "LOADCOMMENTS" : loadCommentsFunction();
						break;
		case "LOADPROFILE" : loadProfileFunction();
						break;	
		case "LOADFRIENDS" : loadFriendsFunction();
						break;
		case "LOADREQUESTS" : loadRequestsFunction();
						break;
		case "COUNTREQUESTS" : countRequestsFunction();
						break;
		case "POSTCOMMENT" : postCommentFunction();
						break;
		case "SESSION" : sessionFunction();
						break;
		case "GETCOOKIE" : getCookieFunction();
						break;
		case "ACCEPTREQUEST" : acceptRequestFunction();
						break;
		case "REJECTREQUEST" : rejectRequestFunction();
						break;
		case "SEARCH" : searchFunction();
						break;
		case "SENDREQUEST" : sendRequestFunction();
						break;
		case "DELETESESSION" : deleteSessionFunction();
						break;
	}

	function createEncryptionProtectedKey($password){
		$sessionKey = getSessionKey();
		$userKey = \Defuse\Crypto\Key::loadFromAsciiSafeString($sessionKey);

		$encrypted_password = \Defuse\Crypto\Crypto::encrypt($password, $userKey);

		$responseEncoded = array("password"=>$encrypted_password);
		return $responseEncoded;
	}

	function decryptPassword($password){
		$storedKey = \Defuse\Crypto\Key::loadFromAsciiSafeString(getSessionKey());
		$decryptedPassword = \Defuse\Crypto\Crypto::decrypt($password, $storedKey);

		return $decryptedPassword;
	}

	function startSessionFunction($uName, $fName, $lName, $checkbox){
		// Store Session Data
		session_start();
		
		$_SESSION['currentUser']= $uName;
		$_SESSION['fName'] = $fName;
		$_SESSION['lName'] = $lName;

		if($checkbox == "on"){
			// Store cookie data
			$cookie_name = "savedUser";
			$cookie_value = $uName;
			setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/");
		}
	}

	function getSessionUser(){
		session_start();
        
        if( isset($_SESSION["currentUser"])) {
			$uName = $_SESSION["currentUser"];
		}

		else {
			$uName = NULL;
		}

		return $uName;
	}

	function getSessionKey(){
		$config = include(__DIR__ . '/config.php');
		return $config['hardcodedKey'];
	}

	function loginFunction() {
		$uName = $_POST["uName"];
		$varPassword = $_POST["uPassword"];
		$checkbox = $_POST["checkbox"];
		
		$loginResponse = dataLogin($uName, $varPassword);

		if ($loginResponse["MESSAGE"] == "SUCCESS") {
			$response = array("firstname"=>$loginResponse["firstname"], "lastname"=>$loginResponse["lastname"]);

			startSessionFunction($uName, $response, $checkbox);

			echo json_encode($response);
		}

		else {
			genericErrorFunction($loginResponse["MESSAGE"]);	
		}
	}	

	function encryptedLoginFunction() {
		$uName = $_POST["uName"];
		$varPassword = $_POST["uPassword"];
		$checkbox = $_POST["checkbox"];

		// To encrypt password
		$responseKey = bringEncryptedPassword($uName);

		if ($responseKey["MESSAGE"] == "SUCCESS") {
			$decryptedPassword = decryptPassword($responseKey["password"]);

			if ($decryptedPassword == $varPassword) {
				$loginResponse = encryptedDataLogin($uName);

				if ($loginResponse["MESSAGE"] == "SUCCESS") {
					$response = array("firstname"=>$loginResponse["firstname"], "lastname"=>$loginResponse["lastname"]);
					
					startSessionFunction($uName, $response['firstname'], $response['lastname'], $checkbox);
					
					echo json_encode($response);
				}

				else {
					genericErrorFunction($loginResponse["MESSAGE"]);	
				}

			}
	
			else {
				genericErrorFunction("406");	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	
	}	

	function registrationFunction() {
		$uName = $_POST["uName"];
		$uPassword = $_POST['uPassword'];
		$fName = $_POST['fName'];
		$lName = $_POST['lName'];
		$uEmail = $_POST['uEmail'];
		$uCountry = $_POST['uCountry'];
		$uGender = $_POST['uGender'];

		$registrationResponse = dataRegister($uName, $uPassword, $fName, $lName, $uEmail, $uCountry, $uGender);

		if ($registrationResponse["MESSAGE"] == "SUCCESS") {
			$response = "New record created successfully";

			startSessionFunction($uName, $fName, $lName, "off");
			echo json_encode($response);
		}

		else {
			genericErrorFunction($registrationResponse["MESSAGE"]);	
		}
	}	

	function encryptedRegistrationFunction() {
		$uName = $_POST["uName"];
		$uPassword = $_POST['uPassword'];
		$fName = $_POST['fName'];
		$lName = $_POST['lName'];
		$uEmail = $_POST['uEmail'];
		$uCountry = $_POST['uCountry'];
		$uGender = $_POST['uGender'];
		$protectedKey = CreateEncryptionProtectedKey($uPassword);

		$eRegistrationResponse = dataEncryptedRegister($uName, $protectedKey["password"], $fName, $lName, $uEmail, $uCountry, $uGender);

		if ($eRegistrationResponse["MESSAGE"] == "SUCCESS") {
			$response = "New record created successfully";

			startSessionFunction($uName, $fName, $lName, "off");
			echo json_encode($response);
		}

		else {
			genericErrorFunction($eRegistrationResponse["MESSAGE"]);	
		}
	}

	function loadFriendsFunction() {
		$uName = getSessionUser();
		if (!is_null($uName)){

			$loadFriendsResponse = dataLoadFriends($uName);

			if ($loadFriendsResponse["MESSAGE"] == "SUCCESS") {
				$response = $loadFriendsResponse["response"];
				echo json_encode($response);
			}

			else {
				genericErrorFunction($loadFriendsResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}	

	function loadRequestsFunction() {
		$uName = getSessionUser();
		if (!is_null($uName)){

			$loadRequestsResponse = dataLoadRequests($uName);

			if ($loadRequestsResponse["MESSAGE"] == "SUCCESS") {
				$response = $loadRequestsResponse["response"];
				echo json_encode($response);
			}

			else {
				genericErrorFunction($loadRequestsResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}	

	function countRequestsFunction() {
		$uName = getSessionUser();
		if (!is_null($uName)){

			$countRequestsResponse = dataCountRequests($uName);

			if ($countRequestsResponse["MESSAGE"] == "SUCCESS") {
				$response = $countRequestsResponse["response"];
				echo json_encode($response);
			}

			else {
				genericErrorFunction($loadRequestsResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}	

	function loadCommentsFunction() {
		$uName = getSessionUser();
		if (!is_null($uName)){

			$loadCommentsResponse = dataLoadComments($uName);

			if ($loadCommentsResponse["MESSAGE"] == "SUCCESS") {
				$response = $loadCommentsResponse["comments"];
				echo json_encode($response);
			}

			else {
				genericErrorFunction($loadCommentsResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}	

	function searchFunction() {
		$uName = getSessionUser();
		if (!is_null($uName)){
			$searchField = $_POST["searchField"];

			$searchResponse = dataSearch($uName, $searchField);

			if ($searchResponse["MESSAGE"] == "SUCCESS") {
				$response = $searchResponse["response"];
				echo json_encode($response);
			}

			else {
				genericErrorFunction($searchResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}	

	function loadProfileFunction() {
		$uName = getSessionUser();
		if (!is_null($uName)){

			$loadProfileResponse = dataLoadProfile($uName);

			if ($loadProfileResponse["MESSAGE"] == "SUCCESS") {
				$response = $loadProfileResponse["response"];
				echo json_encode($response);
			}

			else {
				genericErrorFunction($loadProfileResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}	

	function postCommentFunction() {
		$dbKey = $_POST["dbKey"];
		$text = $_POST["text"];
		$uName = getSessionUser();
		if (!is_null($uName)){
			$postCommentResponse = dataPostComment($uName, $dbKey, $text);

			if ($postCommentResponse["MESSAGE"] == "SUCCESS") {
				$response = "New comment created successfully";
				echo json_encode($response);
			}

			else {
				genericErrorFunction($postCommentResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}
	
	function acceptRequestFunction() {
		$friendName = $_POST["friendName"];
		$uName = getSessionUser();

		if (!is_null($uName)){
			$acceptRequestResponse = dataAcceptRequest($friendName, $uName);

			if ($acceptRequestResponse["MESSAGE"] == "SUCCESS") {
				$response = "Request accepted successfully";
				echo json_encode($response);
			}

			else {
				genericErrorFunction($acceptRequestResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}

	function sendRequestFunction() {
		$friendName = $_POST["friendName"];
		$uName = getSessionUser();

		if (!is_null($uName)){
			$sendRequestResponse = dataSendRequest($friendName, $uName);

			if ($sendRequestResponse["MESSAGE"] == "SUCCESS") {
				$response = "Request sent successfully";
				echo json_encode($response);
			}

			else {
				genericErrorFunction($sendRequestResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}

	function rejectRequestFunction() {
		$friendName = $_POST["friendName"];
		$uName = getSessionUser();

		if (!is_null($uName)){
			$rejectRequestResponse = dataRejectRequest($friendName, $uName);

			if ($rejectRequestResponse["MESSAGE"] == "SUCCESS") {
				$response = "Request rejected successfully";
				echo json_encode($response);
			}

			else {
				genericErrorFunction($rejectRequestResponse["MESSAGE"]);	
			}
		}

		else {
			genericErrorFunction("406");	
		}
	}

	function sessionFunction() {
		session_start();
		if( isset($_SESSION["currentUser"]) && isset($_SESSION["fName"]) && isset($_SESSION["lName"]) ) {
		  	echo json_encode(array("currentUser" => $_SESSION["currentUser"], "fName" => $_SESSION["fName"], "lName" => $_SESSION["lName"]));
		}
		else {
			genericErrorFunction("400");	
		}
	}	

	function getCookieFunction() {
		if( isset($_COOKIE["savedUser"])) {
			$response = array('savedUser' => $_COOKIE["savedUser"]);
			echo json_encode($response);
		}
		else {
			genericErrorFunction("400");	
		}
	}	

	function deleteSessionFunction() {
		session_start();
		session_destroy();
		echo json_encode("log out successful.");
	}	

	function genericErrorFunction($errorCode){
		switch($errorCode)
		{
			case "400" : header("HTTP/1.1 400 Not found");
						 die("Element not found.");
						 break;
			case "500" : header("HTTP/1.1 500 Bad connection, portal down");
						 die("The server is down, we couldn't establish the data base connection.");
						 break;
			case "406" : header("HTTP/1.1 406 User not found.");
						 die("Wrong credentials provided.");
						 break;
			case "409" : header("HTTP/1.1 406 User already exists.");
						 die("Wrong credentials provided.");
						 break;
			case "204" : header("HTTP/1.1 406 No comments.");
						 die("No comments in database.");
						 break;

		}
	}
?>