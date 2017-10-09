var currentUser = "pecster";

// JQuery
$(document).ready(function(){
    // Hide all error spans
    $(".errorSpan").hide();

    // Submit button listener
    $("#newCommentSubmit").click(function( event ) {
        event.preventDefault();
        newCommentListener();
    });

    // Change on gender elements
    $('#newCommentText').change(function( event ) {
        $("#commentEmpty").hide();
    });

    $('#profileSection').on('classChange', function() {
        getProfileData("./data/loadProfile.php");
   });

    // Uses AJAX
    getCommentsData("./data/loadComments.php");

    // Menu control
    $("#myNavbar li").on("click", function(){
		$(".active").removeClass("active");
		var currentClass = $(this).attr("class");
		$(this).addClass("active");

        $(".selectedSection").removeClass("selectedSection").addClass("notSelectedSection");

		$("#" + currentClass + "Section").addClass("selectedSection").removeClass("notSelectedSection").trigger('classChange');
	});
});

function newCommentListener() {
    var nameField = currentUser;
    var text = $("#newCommentText").val();

    if(text.trim() != ''){
        $("#commentEmpty").hide();
        $("#commentSection" ).append('<li class="list-group-item"> <span style="font-weight:bold">' + nameField + "<br> </span> " + text + '</li>');
    }
    else {
        $("#commentEmpty").show();
    }
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
        "uName" : currentUser
    };

    // PHP login service
    $.ajax({
        url: urlPHP,
        type: "GET",
        dataType: "json",
        success: function (jsonResponse){    
            for (var key in jsonResponse) {
                if (jsonResponse.hasOwnProperty(key)) {        
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
    var jsonData = { 
        "uName" : currentUser
    };
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
