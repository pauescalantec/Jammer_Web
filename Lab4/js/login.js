var validUser = "lab4";
var validPass = "lab4";

// Jquery methods
$(document).ready(function(){
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
    var validCredentials = true;

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
        // check username
        if(nameField != validUser){
            validCredentials = false;
        }

        // check password
        if(passwordField != validPass){
            validCredentials = false;
        }
    }

    if(!validCredentials){
        $("#userInvalid").show();
    }

    if(validInput && validCredentials) {
        window.location.href = "home.html";
    }
}