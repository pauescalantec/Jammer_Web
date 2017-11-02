// Global variables
var genderChosen = false;

// Jquery methods
$(document).ready(function(){
    // check session here, if already logged in do not attempt register

    // Hide all error spans
    $(".errorSpan").hide();

    // Submit button listener
    $("#submitButton").click(function( event ) {
        event.preventDefault();
        submitListener();
    });

    // Change on any form element
    $(".formElement").change(function( event ) {
        focusOut($(this).attr("id"));
    });

    // Change on country element
    $("#country").change(function( event ) {
        if($("#country option:selected").index() != 0) {
            $("#countryEmpty").hide();
        }
    });

    // Change on gender elements
    $('[name="gender"]').change(function( event ) {
        $("#genderEmpty").hide();
    });
});

// Input is recorded, hide empty field alert
function focusOut(objectID){
    $("#" + objectID + "Empty").hide();
}

// Validates text input
function validateInput(objectID, value){
    // Field empty
    if(!value){
        $(objectID).show();
        return false;
    }

    $(objectID).hide();
    return true;
}

// Helper listener function
function submitListener() {
    var validInput = true;
    $("#passwordInvalid").hide();
    $("#usernameUsed").hide();

    // Validate text fields
    validInput = (validateInput("#firstNameEmpty", $("#firstName").val()) && validInput);
    validInput = (validateInput("#lastNameEmpty", $("#lastName").val()) && validInput);
    validInput = (validateInput("#usernameEmpty", $("#username").val()) && validInput);
    validInput = (validateInput("#emailEmpty", $("#email").val()) && validInput);

    validInput = (validateInput("#passwordEmpty", $("#password").val()) && validInput);
    validInput = (validateInput("#passwordConfirmationEmpty", $("#passwordConfirmation").val()) && validInput);

    // Validate country field
    var countryPick = $("#country option:selected").index();

    if(countryPick == 0){
        $("#countryEmpty").show();
        validInput = false;
    }
    else {
         $("#countryEmpty").hide();
    }

    // Validate gender radii
    var genderFlag = false;
    var genderText = "";

    $('[name="gender"]').each(function(index, value) {
        if(value.checked){
            genderFlag = true;
        }
    });

    if(!genderFlag){
        $("#genderEmpty").show();
        validInput = false;
    }
    else {
        $("#genderEmpty").hide();
    }

    // Validate passwords match, after input is validated
    if(validInput){
        // Redirect to home
        if($("#password").val() == $("#passwordConfirmation").val()){
            var jsonData = {
                "uName" : $("#username").val(),
                "uPassword" : $("#password").val(),
                "fName" : $("#firstName").val(),
                "lName" : $("#lastName").val(),
                "uEmail" : $("#email").val(),
                "uCountry" : $("#country option:selected").text(),
                "uGender" : $('input[name="gender"]:checked').val(),
                "action" : "EREGISTRATION"
            };

            // register user
            registerUser("./data/applicationLayer.php", jsonData);
        }
        else {
            $("#passwordEmpty").hide();
            $("#passwordInvalid").show();
        }
    }
}

function registerUser(urlPHP, jsonData){
    $.ajax({
        type: "POST",
        url: urlPHP,
        data : jsonData,
        dataType : "json",
        ContentType : "application/json",
        success: function(jsonData) {
            window.location.replace("home.html");
        },
        error: function(errorMessage){
            if(errorMessage.status == "409" || errorMessage.status == "406" ) {
                $("#usernameEmpty").hide();
                $("#usernameUsed").show();
            }
            else {
                alert(errorMessage.responseText);
            }
            
        }
    });
}