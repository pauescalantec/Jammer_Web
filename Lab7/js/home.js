var currentUser = "";
var totalComments = 0;

// JQuery
$(document).ready(function(){
    // Hide all error spans
    $(".errorSpan").hide();

    // Check session
    checkSession("./data/session.php");

    // Submit button listener
    $("#newCommentSubmit").click(function( event ) {
        event.preventDefault();
        newCommentListener();
    });

    $("#logoutButton").click(function( event ) {
        handleLogout("./data/deleteSession.php");
    });

    // Change on gender elements
    $('#newCommentText').change(function( event ) {
        $("#commentEmpty").hide();
    });

    $('#profileSection').on('classChange', function() {
        getProfileData("./data/loadProfile.php");
   });

    // Menu control
    $("#myNavbar li").on("click", function(){
		$(".active").removeClass("active");
        var currentClass = $(this).attr("class");

        // Options is just a dropdown menu
        if (currentClass != "dropdown" && currentClass != "options" && currentClass != "dropdown open") {
            $(this).addClass("active");
            
            $(".selectedSection").removeClass("selectedSection").addClass("notSelectedSection");
    
            $("#" + currentClass + "Section").addClass("selectedSection").removeClass("notSelectedSection").trigger('classChange');
        }
	});
});

function handleLogout(urlPHP){
    $.ajax({
        url: urlPHP,
        type: "GET",
        success: function(jsonResponse) {
            window.location.replace("index.html");
        },
        error: function() {
            alert("Error logging out. Try again later.");
        }
    });   
}

function checkSession(urlPHP){
    $.ajax({
        url: urlPHP,
        type: "GET",
        dataType: "json",
        success: function(jsonResponse) {
            $('#profileText').html('<span class="glyphicon glyphicon-user"></span> ' + jsonResponse.fName + " " + jsonResponse.lName);
            currentUser = jsonResponse.currentUser;
            // Uses AJAX
            getCommentsData("./data/loadComments.php");
        },
        error: function() {
            currentUser = "";
            window.location.replace("index.html");
        }
    });   
}

function newCommentListener() {
    var text = $("#newCommentText").val();

    if(text.trim() != ''){
        // Key for comment
        var dt = new Date();
        var utcDate = dt.toUTCString().replace(/\s/g, '');
        var dbKey = totalComments + currentUser + utcDate;

        var jsonData = { 
            "dbKey" : dbKey,
            "text" : text
        };

        // Insert to DB
        postComment("./data/postComment.php", jsonData);
        /*$("#commentSection" ).append('<li class="list-group-item"> <span style="font-weight:bold">' + nameField + "<br> </span> " + text + '</li>');*/
    }
    else {
        $("#commentEmpty").show();
    }
}

function postComment(urlPHP, jsonData){
    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){    
            // Reload comments
            getCommentsData("./data/loadComments.php");
        
            $("#commentEmpty").hide();
        },
        error: function (errorMessage){
            alert(errorMessage.responseText);
        }
    });
}

function populateProfile(jsonResponse) {  
    // First and last names separated by break
    $("#name").html( jsonResponse.firstname + " <br> " + jsonResponse.lastname);

    // User fields
    $("#username").text( jsonResponse.username);
    $("#email").text( jsonResponse.email);
    $("#gender").text( jsonResponse.gender);

    // Get code for flag code
    var flagCode;
    $.each(countries(), function(i, v) {
        if(v.cname == jsonResponse.country){
            flagCode = v.ccode;
        }
    });

    // Contains the flag path for the specified country
    var flagHTML = '<img src="/media/blank.gif" class="flag flag-' +  flagCode.toLowerCase() + '" alt=""/>';

    // Change HTML to contain both flag icon and country name
    $("#country").html(flagHTML + " " + jsonResponse.country);
}

function getCommentsData(urlPHP) {
    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "GET",
        dataType: "json",
        success: function (jsonResponse){    
            $("#commentSection").html("");
            totalComments = 0;

            for (var key in jsonResponse) {
                if (jsonResponse.hasOwnProperty(key)) {
                    totalComments ++;            
                    $("#commentSection").append('<li class="list-group-item"> <strong>' + jsonResponse[key].owner + "<br> </strong> " + jsonResponse[key].note + '</li>');
                }
            }
        },
        error: function (errorMessage){
            if (errorMessage.status == "406"){
                // No comments available, populate accordingly
                //alert("no comments");      
            }

            else {
                alert(errorMessage.responseText + " Please try again.");
            }
        }
    });
}

function getProfileData(urlPHP) {
    // Get JSON from ProfileData PHP
    $.ajax({
        url: urlPHP,
        type: "GET",
        dataType: "json",
        success: function(jsonResponse) {
            populateProfile(jsonResponse);
        },
        error: function() {
            alert("An error occurred while getting profile data.");
        }
    });
}
