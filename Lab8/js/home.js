var currentUser = "";
var totalComments = 0;

// JQuery
$(document).ready(function(){
    // Hide all error spans
    $(".errorSpan").hide();

    // Check session
    checkSession("./data/applicationLayer.php");

    // Submit button listener
    $("#newCommentSubmit").click(function( event ) {
        event.preventDefault();
        newCommentListener();
    });

    $("#searchField").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#startSearch").click();
        }
    });

    $("#startSearch").click(function( event ) {
        event.preventDefault();
        startSearch("./data/applicationLayer.php");
    });

    $("#logoutButton").click(function( event ) {
        handleLogout("./data/applicationLayer.php");
    });

    // Change on gender elements
    $('#newCommentText').change(function( event ) {
        $("#commentEmpty").hide();
    });

    $('#profileSection').on('classChange', function() {
        getProfileData("./data/applicationLayer.php");
    });

    $('#homeSection').on('classChange', function() {
        getCommentsData("./data/applicationLayer.php");
        getRequestsCount("./data/applicationLayer.php");
    });

    $('#friendsSection').on('classChange', function() {
        getFriendsData("./data/applicationLayer.php");
    });

    $('#requestsSection').on('classChange', function() {
        getRequestsData("./data/applicationLayer.php");
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
    var jsonData = {
        "action" : "DELETESESSION"
    };
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function(jsonResponse) {
            window.location.replace("index.html");
        },
        error: function(errorMessage) {
            alert("Error logging out. Try again later.");
        }
    });   
}

function checkSession(urlPHP){
    var jsonData = {
        "action" : "SESSION"
    };
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function(jsonResponse) {
            $('#profileText').html('<span class="glyphicon glyphicon-user"></span> ' + jsonResponse.fName + " " + jsonResponse.lName);
            currentUser = jsonResponse.currentUser;
            // Uses AJAX
            getCommentsData("./data/applicationLayer.php");
            getRequestsCount("./data/applicationLayer.php");
        },
        error: function() {
            currentUser = "";
            window.location.replace("index.html");
        }
    });   
}

function newCommentListener() {
    var text = $("#newCommentText").val();
    $("#newCommentText").val("");

    if(text.trim() != ''){
        // Key for comment
        var dt = new Date();
        var utcDate = dt.toUTCString().replace(/\s/g, '');
        var dbKey = totalComments + currentUser + utcDate;

        var jsonData = { 
            "dbKey" : dbKey,
            "text" : text,
            "action" : "POSTCOMMENT"
        };

        // Insert to DB
        postComment("./data/applicationLayer.php", jsonData);
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
            getCommentsData("./data/applicationLayer.php");
        
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
    var jsonData = {
        "action" : "LOADCOMMENTS"
    };

    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){    
            $("#commentSection").html("");
            totalComments = 0;

            for (var key in jsonResponse) {
                if (jsonResponse.hasOwnProperty(key)) {
                    totalComments ++;            
                    $("#commentSection").append('<li id="commentList" class="list-group-item"> <strong>' + jsonResponse[key].owner + "<br> </strong> " + jsonResponse[key].note + '</li>');
                }
            }

            if ($('#commentSection').prop('scrollHeight') > $('#commentSection').prop('clientHeight')){
                $('#overflowAlert').remove();  
                $('#commentsAndNotes').append('<p id="overflowAlert" style="text-align: center; color:gray;">Scroll for more comments...</p>');
            }

            else {
                $('#overflowAlert').remove();   
            }
        },
        error: function (errorMessage){
            if (errorMessage.status == "406"){
                // No comments available, populate accordingly
                $("#commentSection").html("");  
                $('#commentSection').append('<p id="noComments" style="text-align: center; padding-top:20px; color:gray;">No comments added yet...</p>');    
            }

            else {
                alert(errorMessage.responseText + " Please try again.");
            }
        }
    });
}

function getFriendsData(urlPHP) {
    var jsonData = {
        "action" : "LOADFRIENDS"
    };

    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){    
            $("#listFriendsSection").html("");
            totalFriends = 0;

            for (var key in jsonResponse) {
                if (jsonResponse.hasOwnProperty(key)) {
                    totalFriends ++;            
                    $("#listFriendsSection").append('<li class="list-group-item"> <h4>' + jsonResponse[key].username + "</h4> </strong> " + jsonResponse[key].fullName + '<br> ' + jsonResponse[key].email + '</li>');
                }
            }

            if ($('#listFriendsSection').prop('scrollHeight') > $('#listFriendsSection').prop('clientHeight')){
                $('#overflowFriendsAlert').remove();  
                $('#friendsOverflowCheck').append('<p id="overflowFriendsAlert" style="text-align: center; color:gray;">Scroll for more friends...</p>');
            }

            else {
                $('#overflowFriendsAlert').remove();   
            }
        },
        error: function (errorMessage){
            if (errorMessage.status == "406"){
                // No friends available, populate accordingly
                $("#listFriendsSection").html("");  
                $('#listFriendsSection').append('<p id="noFriends" style="text-align: center; padding-top:20px; color:gray;">No friends yet, go to search tab to find new friends...</p>');    
            }

            else {
                alert(errorMessage.responseText + " Please try again.");
            }
        }
    });
}

function getProfileData(urlPHP) {
    var jsonData = {
        "action" : "LOADPROFILE"
    };
    // Get JSON from ProfileData PHP
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function(jsonResponse) {
            populateProfile(jsonResponse);
        },
        error: function() {
            alert("An error occurred while getting profile data.");
        }
    });
}

function getRequestsData(urlPHP) {
    var jsonData = {
        "action" : "LOADREQUESTS"
    };

    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){    
            $("#listRequestsSection").html("");
            totalRequests = 0;
            for (var key in jsonResponse) {
                if (jsonResponse.hasOwnProperty(key)) {
                    totalRequests ++;            
                    $("#listRequestsSection").append('<li class="list-group-item id="'  + jsonResponse[key].username + 'List"> <h4>' + jsonResponse[key].username + "</h4> " + jsonResponse[key].fullName + '<br> ' + jsonResponse[key].email + '<div style="padding-bottom: 7px;"> <input name="acceptRequestButton" class="buttonLogin-small" style="display: inline-block;" type="button" value="Accept" id="'  + jsonResponse[key].username + '"> <input class="buttonRegister-small" name="rejectRequestButton" style="display: inline-block;" type="button" value="Reject" id="'  + jsonResponse[key].username + '"> </div>' + '</li>' );
                }
            }

            $("[name='acceptRequestButton']").on("click", function() {
                acceptRequest(this.id, "./data/applicationLayer.php");
            });

            $("[name='rejectRequestButton']").on("click", function() {
                rejectRequest(this.id, "./data/applicationLayer.php");
            });

            if ($('#listRequestsSection').prop('scrollHeight') > $('#listRequestsSection').prop('clientHeight')){
                $('#overflowAlertRequests').remove();  
                $('#requestsOverflowCheck').append('<p id="overflowAlertRequests" style="text-align: center; color:gray;">Scroll for more requests...</p>');
            }

            else {
                $('#overflowAlertRequests').remove();   
            }
        },
        error: function (errorMessage){
            if (errorMessage.status == "406"){
                // No requests available, populate accordingly
                $("#listRequestsSection").html("");  
                $('#listRequestsSection').append('<p id="noRequests" style="text-align: center; padding-top:20px; color:gray;">No friend requests...</p>');   
            }

            else {
                alert(errorMessage.responseText + " Please try again.");
            }
        }
    });
}

function acceptRequest(friendName, urlPHP){
    $("#acceptedAlert").alert("close");
    $("#rejectedAlert").alert("close");

    var jsonData = {
        "friendName" : friendName,
        "action" : "ACCEPTREQUEST"
    };

    // PHP accept request
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){   
            // success
            setTimeout(function() {
                $("#containsRequests").prepend('<div class="alert alert-success alert-dismissable fade in" id="acceptedAlert"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Friend request accepted. </div>');

                //reload page
                reloadPage();
            }, 400);   
        },
        error: function (errorMessage){
            alert(errorMessage.responseText);
        }
    });
}

function rejectRequest(friendName, urlPHP){
    $("#rejectedAlert").alert("close");
    $("#acceptedAlert").alert("close");

    var jsonData = {
        "friendName" : friendName,
        "action" : "REJECTREQUEST"
    };
    
    // PHP accept request
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){   
            // success
            setTimeout(function() {
                $("#containsRequests").prepend('<div class="alert alert-danger alert-dismissable fade in" id="rejectedAlert"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Friend request rejected. </div>');

                //reload page
                reloadPage();
            }, 400);   
        },
        error: function (errorMessage){
            alert(errorMessage.responseText);
        }
    });
}

function getRequestsCount(urlPHP) {
    var jsonData = {
        "action" : "COUNTREQUESTS"
    };

    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){    
            if(jsonResponse.count > 0){
                $("#spanCount").text("(" + jsonResponse.count + ")");
            }

            else {
                $("#spanCount").text("");  
            }
        },
        error: function (errorMessage){
            if (errorMessage.status == "406"){
                // No requests available, populate accordingly
                // Show no requests
                $("#spanCount").text("");   
            }

            else {
                alert(errorMessage.responseText + " Please try again.");
            }
        }
    });
}

function startSearch(urlPHP){
    var nameField = $("#searchField").val();

    var jsonData = {
        "searchField" : nameField,
        "action" : "SEARCH"
    };

    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){    
            $("#listSearchSection").html("");
            totalResults = 0;

            for (var key in jsonResponse) {
                if (jsonResponse.hasOwnProperty(key)) {
                    totalResults ++;            
                    $("#listSearchSection").append('<li class="list-group-item id="'  + jsonResponse[key].username + 'List"> <h4>' + jsonResponse[key].username + "</h4> " + jsonResponse[key].fullName + '<br> ' + jsonResponse[key].email + '<div style="padding-bottom: 7px;"> <input name="addFriendButton" class="buttonLogin-small" style="display: inline-block;" type="button" value="Add Friend" id="'  + jsonResponse[key].username + '"> </li>' );
                }
            }

            $("[name='addFriendButton']").on("click", function() {
                addFriend(this.id, "./data/applicationLayer.php");
            });

            if ($('#listSearchSection').prop('scrollHeight') > $('#listSearchSection').prop('clientHeight')){
                $('#overflowAlert').remove();  
                $('#searchOverflowCheck').append('<p id="overflowAlert" style="text-align: center; color:gray;">Scroll for more results...</p>');
            }

            else {
                $('#overflowAlert').remove();   
            }
        },
        error: function (errorMessage){
            if (errorMessage.status == "406"){
                // No results available, populate accordingly
                $("#listSearchSection").html("");  
                $('#listSearchSection').append('<p id="noResults" style="text-align: center; padding-top:20px; color:gray;">No search results...</p>');    
            }

            else {
                alert(errorMessage.responseText + " Please try again.");
            }
        }
    });
}

function addFriend(friendName, urlPHP){
    $("#sentAlert").alert("close");

    var jsonData = {
        "friendName" : friendName,
        "action" : "SENDREQUEST"
    };

    // PHP accept request
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){   
            // success
            setTimeout(function() {
                $("#containsSearch").prepend('<div class="alert alert-success alert-dismissable fade in" id="sentAlert"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Friend request sent. </div>');

                //reload page
                reloadPage();
                startSearch("./data/applicationLayer.php");
            }, 400);   
        },
        error: function (errorMessage){
            alert(errorMessage.responseText);
        }
    });
}

function reloadPage() {
    getFriendsData("./data/applicationLayer.php");
    getRequestsData("./data/applicationLayer.php");
    getCommentsData("./data/applicationLayer.php");
    getRequestsCount("./data/applicationLayer.php");
}
