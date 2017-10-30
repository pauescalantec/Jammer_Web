var validUser = "lab5";
var validPass = "lab5";

// Jquery methods
$(document).ready(function(){
    // check session here, if already logged in do not attempt log in
    getCookieData("./data/applicationLayer.php");

    // Hide all error spans
    $(".errorSpan").hide();

    // Submit button listener
    $("#submitButton").click(function( event ) {
        event.preventDefault();
        submitListener();
    });

    // Name field listener for change
    $("#nameField").change(function( event ) {
        userNameFocusOut();
    });

    // Password field listener for change
    $("#passwordField").change(function( event ) {
        passwordFocusOut();
    });
});

function getCookieData(urlPHP){
    var jsonData = { 
        "action" : "GETCOOKIE"
    };
    // PHP cookie service
    $.ajax({
        url: urlPHP,
        type: "POST",
        data: jsonData,
        dataType: "json",
        success: function (jsonResponse){
            $("#nameField").val(jsonResponse.savedUser);    
        }
    });
}

// Check userName
function userNameFocusOut(){
    $("#userInvalid").hide();
    $("#userNameEmpty").hide();
}

// Check password
function passwordFocusOut(){
    $("#userInvalid").hide();
    $("#userPasswordEmpty").hide();
}

// Helper listener function
function submitListener() {
    var validInput = true;
    var validCredentials = false;

    $("#userInvalid").hide();
    var nameField = $("#nameField").val();
    var passwordField = $("#passwordField").val();

    // Username empty
    if(!nameField){
        $("#userNameEmpty").show();
        validInput = false;
    }
    else {
        $("#userNameEmpty").hide();
    }

    // Password empty
    if(!passwordField){
        $("#userPasswordEmpty").show();
        validInput = false;
    }
    else {
        $("#userPasswordEmpty").hide();
    }

    if(validInput){
        var checkbox = "off";
        if($("#remember").is(":checked")){
            checkbox = "on";
        }
        
        var jsonData = { 
            "uName" : nameField,
            "uPassword" : passwordField,
            "checkbox" : checkbox,
            "action" : "LOGIN"
        };

        // PHP login service
        $.ajax({
            url: "./data/applicationLayer.php",
            type: "POST",
            data: jsonData,
            dataType: "json",
            success: function (jsonResponse){
                validCredentials = true;     
                window.location.href = "home.html";        
            },
            error: function (errorMessage){
                validCredentials = false;
                if (errorMessage.status == "406"){
                    $("#userInvalid").show();
                }

                else {
                    alert(errorMessage.responseText + " Please try again.");
                }
            }
        });
    }
}