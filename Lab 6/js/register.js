// Global variables
var genderChosen = false;

// Jquery methods
$(document).ready(function(){
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

    // Validate text fields
    validInput = validateInput("#firstNameEmpty", $("#firstName").val());
    validInput = validateInput("#lastNameEmpty", $("#lastName").val());
    validInput = validateInput("#usernameEmpty", $("#username").val());
    validInput = validateInput("#emailEmpty", $("#email").val());

    validInput = validateInput("#passwordEmpty", $("#password").val());
    validInput = validateInput("#passwordConfirmationEmpty", $("#passwordConfirmation").val());

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
        if(passwordField == passwordCField){
            window.location.href = "home.html";
        }
        else {
            $("#passwordEmpty").hide();
            $("#passwordInvalid").show();
        }
    }
}