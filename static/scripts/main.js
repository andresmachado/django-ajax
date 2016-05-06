$(function() {

// nothing

console.log("nothing")

$(function() {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});

function delete_post(post_primary_key){
    if (confirm('are you sure you want to remove this post?')==true){
        $.ajax({
            url: 'delete_post/',
            type: 'DELETE',
            data: { postpk: post_primary_key },
            success : function(json) {
                $('#post-'+post_primary_key).hide();
                console.log("post deletion successful");
            },

            error: function(xhr, errmsg, err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>"+
                    "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    } else {
        return false;
    }
}

function create_post() {
    console.log('create post is working!')
    $.ajax({
        url: "create_post/",
        type: "POST",
        data: { the_post : $("#post-text").val() },

        success: function (json) {
            $('#post-text').val('');
            console.log(json);
            $("#talk").prepend("<li id='post-"+json.postpk+"'><strong>"+json.text+"</strong> - <em> "+json.author+"</em> - <span> "+json.created+
                "</span> - <a id='delete-post-"+json.postpk+"'>delete me</a></li>");
            console.log("success");
        },

        error : function (xhr, errmsg, err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+" <a href='#' class='close'>&times;</a></div>");
            console.log(xhr.status + ": " + xhr.responseText);
        }
    })
};

$('#post-form').on('submit', function(event) {
    event.preventDefault();
    console.log('form submitted!')
    create_post();
})

$("#talk").on('click', 'a[id^=delete-post-]', function(){
    var post_primary_key = $(this).attr('id').split('-')[2];
    console.log(post_primary_key)
    delete_post(post_primary_key);
});

});