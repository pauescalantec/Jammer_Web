// JQuery
$(document).ready(function(){
    // Submit button listener
    $("#newCommentSubmit").click(function( event ) {
        event.preventDefault();
        newCommentListener();
    });

    $.ajax({
        type: "GET" ,
        url: "comments.xml" ,
        dataType: "xml" ,
        success: function(xml) {
            $(xml).find('contact').each(function(){
                var sText = $(this).find('text').text();
                var sName = $(this).find('name').text();
                $("#commentSection" ).append('<li class="list-group-item">' + sName + ": " + sText +  '</li>');
            });
        },
        error: function() {
            alert("An error occurred while processing XML file.");
        } 
    });
});

function newCommentListener() {
    var nameField = "lab4";
    var text = $("#newCommentText").val();
    $("#commentSection" ).append('<li class="list-group-item">' + nameField + ": " +  text +  '</li>');
}
