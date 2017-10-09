<?php 
  session_start();
  if( isset($_SESSION["currentUser"])) {
    $currentUser = $_SESSION["currentUser"];
  }
  else {
    //return to log in
  }
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jammer</title>
  <link rel="stylesheet" href="CSS/styles.css" type="text/css">
  <link href="css/flags.css" rel=stylesheet type="text/css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
<body>
  <div class="banner">
    <img style="vertical-align: middle;" src="media/jammer_logo_home.png" alt="Add Block" width="7%;">
    <h1 class="jammerTitle">Jammer</h1>
  </div>
  <div id="wrapper">
    <nav class="navbar navbar-default">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span> 
        </button>
      </div>

      <div class="collapse navbar-collapse" id="myNavbar">
        <ul id="leftMenu" class="nav navbar-nav">
          <li class="active home"><a href="#">Home</a></li>
          <li class="about"><a href="#">About</a></li>
        </ul>
        <ul id="rightMenu" class="nav navbar-nav navbar-right">
          <li id="profileSection "class="profile"><a href="#"><span class="glyphicon glyphicon-user"></span> <?php echo $currentUser ?></a></li>
        </ul>
      </div>
      
    </nav>

    <div id ="homeSection" class="selectedSection"> 
      <div class="container">
          <div class="row">
            <div class="col-sm-6">
              <div class="panel panel-default">
                <div class="panel-heading"><h3>Notes/Comments</h3></div>
                <div class="panel-body">
                  <ul id="commentSection" class="list-group">
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="panel panel-default">
                <div class="panel-heading"><h3>Add Comments</h3>
                </div>
                <div class="panel-body">
                  <textarea id="newCommentText" class="form-control" rows="5" id="comment"></textarea>
                  <input id="newCommentSubmit" class="buttonLogin-small"  style="display: inline-block;" type="button" value="Post comment">
                    <span id="commentEmpty" class="errorSpan">
                      Please type a comment
                    </span>
                  </input>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <div id ="profileSection" class="notSelectedSection"> 
      <div class="container">
        <div class="jumbotron" style="background-color: #e9f4fb;">
          <div class="media">
            <div class="media-body">
              <h1 id="name" class="media-heading" style="font-size: 63px;">First Name <br> Last Name</h1>
            </div>
            <div class="media-right media-middle">
              <img src="media/userIcon.png" class="media-object" style="width:130px;">
            </div>
          </div>
        </div>
        <legend>Username </legend>
        <div id="username" class="well">username</div>
        <legend>Email </legend>
        <div id="email" class="well">Email@email.com</div>
        <legend>Gender </legend>
        <div id="gender" class="well">Gender </div>
        <legend>Country </legend>
        <div id="country" class="well">
          Country
        </div>
      </div>
    </div>

    <div id ="aboutSection" class="notSelectedSection"> 
        <div class="container">
          <div class="well">About</div>
        </div>
    </div>

    <div class='push'></div>
  </div>
  <div class="footer2">
    <p style="margin-top: 0px;"><strong>Jammer</strong></p>
    Connecting and sharing with people since <span style="font-weight:bold;">2017</span>
  </div>
  <script src="js/jquery.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="js/flags.js"></script> 
  <script type="text/javascript" src="js/home.js"></script>
</body>
</html>