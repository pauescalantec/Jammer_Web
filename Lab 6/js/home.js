var currentUser = "lab5";
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
        getJSONData("media/profileData.json");
   });

    // Uses AJAX
    getXMLData("media/comments.xml");

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
    $("#name").html( jsonResponse.name.firstName + " <br> " + jsonResponse.name.lastName);

    // User fields
    $("#username").text( jsonResponse.username);
    $("#email").text( jsonResponse.email);
    $("#gender").text( jsonResponse.gender == 'M' ? "Male":"Female");

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

function getXMLData(urlXML) {
    // Get XML from comments.xml
    $.ajax({
        type: "GET",
        url: urlXML,
        dataType: "xml",
        success: function(xml) {
            $(xml).find('contact').each(function() {
                var sText = $(this).find('text').text();
                var sName = $(this).find('name').attr("username");
                $("#commentSection").append('<li class="list-group-item"> <strong>' + sName + "<br> </strong> " + sText + '</li>');
            });
        },
        error: function() {
            alert("An error occurred while processing XML file.");
        }
    });
}

function getJSONData(urlJSON) {
    // Get JSON from ProfileData.json
    $.ajax({
        type: "GET",
        url: urlJSON,
        dataType: "json",
        success: function(jsonResponse) {
            populateProfile(jsonResponse);
        },
        error: function() {
            alert("An error occurred while processing JSON file.");
        }
    });
}
