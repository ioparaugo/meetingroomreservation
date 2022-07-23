
$(document).ready(function () {
    hideSections();

    $("#usertype").on("change", function () {
        hideSections();
        switch (Number($(this).val())) {
            case 1: {
                $('section#admin').show();
            }
                break;
            case 2: {
                $('section#employee').show();
            }
                break;
            case 2: {
                $('section#cleaning').show();
            }
                break;
            default: {
                hideSections();
            }
        }
        
    });

    $("#submit").on("click", function (e) {
        if (!ConfirmPassword()) {
            $('#alert-msg').html("Passwords do not match");
            $("#alert-msg").show();
            e.preventDefault();
        }
        else if ($("#usertype option:selected").val() == 0) {
            $('#alert-msg').html("Select a User Type");
            $("#alert-msg").show();
            e.preventDefault();
        }
        else {
            Register();
        }
    })
});

function hideSections() {
    var sections = $("form#register section");
    $.each(sections, function (index, value) {
        if ($(this).attr("id") != "general") {
            $(this).hide();
        }

    });
}

function Register() {
    var User = {
        portaluserType: $('#usertype option:selected').val(),
        FirstName: $('#fname').val(),
        LastName: $('#lname').val(),
        EmailAddress: $('#useremail').val(),
        PhoneNumber: $('#mobile').val(),
        Password: $('#userpassword').val(),
        Department: $("#department").val() != null ? $("#department").val() : "",
        Manager: $("#manager").val() != null ? $("#manager").val() : "",
        JobTitle: $("#jobtitle").val() != null ? $("#jobtitle").val() : "",
       }

    $.ajax({
        type: "POST",
        url: "/Home/CreateUser",
        data: '{user: ' + JSON.stringify(User) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                $("#alertsuccess").show();
                $("#register").hide();

            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            if (response != null) {
                $("#alertsuccess").show();
                $("#register").hide();

            }
        }
    });

}

function validateRequiredFields() {
    var reqFields = $("form#register *[required='required']")
    var fieldsArray = [];
    $.each(reqFields, function (index, value) {
        if ($(this).val() == "") {
            fieldsArray.push($(this));
        }
    });
    return fieldsArray;
}

function ConfirmPassword() {
    var password = $("#userpassword").val();
    var confirmpassword = $("#confirmpassword").val();
    if (password === confirmpassword) {
        return true;
    }
    else {
        return false;
    }
}