<?php 
  if( isset($_COOKIE["savedUser"])) {
    $response = array('savedUser' => $_COOKIE["savedUser"]);
    echo json_encode($response);
  }
  else {
    //return to log in error
    header("HTTP/1.1 400 Cookie not found");
    die(json_encode(array("message" => "Error", "code" => 1337)));
  }
?>