<?php 
  session_start();
  if( isset($_SESSION["currentUser"]) && isset($_SESSION["fName"]) && isset($_SESSION["lName"]) ) {
    echo json_encode(array("currentUser" => $_SESSION["currentUser"], "fName" => $_SESSION["fName"], "lName" => $_SESSION["lName"]));
  }
  else {
    //return to log in error
    header("HTTP/1.1 400 Session not found");
    die(json_encode(array("message" => "Error", "code" => 1337)));
  }
?>