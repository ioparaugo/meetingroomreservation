$(document).ready(function () {

    $("#logout").css({ "display": "inline-block" });
    $("#signin").css({ "display": "none" });

    //check if the logged in user is an admin and show and hide the available building tabs

    if ($('#logginuserrole').val() == "Admin") {
        $('#list1').show();
        $('#list1 button').addClass("active")
        $('div #avlbuildings').addClass('active')
        $('div #avlbuildings').addClass('show');
        $('div #avlmeetingrooms').removeClass('active')
        $('div #avlmeetingrooms').removeClass('show');
        //Building buttons
        var arr = $('.action');
        $.each(arr, function (i, val) {
            if ($(this).parent().siblings()[2].textContent == "Accessible") {
                $(this).text("Disable");
                $(this).addClass("btn-outline-secondary").removeClass("btn-outline-primary");
            }
            else {
                $(this).text("Enable");
            }
        });

        //meeting room buttons

    }
    else {
        $('#list1').css({ "display": "none" });
        $('#list2 button').addClass("active")
        $('div #avlbuildings').removeClass('show')
        $('div #avlbuildings').removeClass('active');
        $('div #avlmeetingrooms').addClass('active')
        $('div #avlmeetingrooms').addClass('show');
        
    }

    //change color if building is accessible
    var arr = $('.isaccessible');
    $.each(arr, function (i, val) {
        if ($(this).text() == "Inaccessible") {
            $(this).removeClass('bg-info').addClass('bg-danger');
        }
        
    });
   
    $("#building").on("change", function () {
        $("#room option").remove();
        $.ajax({
            type: "POST",
            url: "/Home/GetRooms",
            data: '{id: "' + $("#building option:selected").val() + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length > 0) {
                    $(response).each(function () {
                        var option = $("<option />");

                        //Set Room Name in Text part.
                        option.html(this.RoomName);

                        //Set Room ID in Value part.
                        option.val(this.RoomEntityId);

                        //Add the Option element to DropDownList.
                        $("#room").append(option);
                    });
                }
            },
            failure: function (response) {
                alert(response.responseText);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
});

function PostBookingRequest() {

    var booking = {
        subject: $('#subject').val(),
        building: {
            BuildingId: $('#building option:selected').val(),
            BuildingName: $('#building option:selected').text()
        },
        room: {
            RoomEntityId: $('#room option:selected').val(),
            RoomName: $('#room option:selected').text()
        },
        startDate: $('#startdate').val(),
        timeslot: $('#time').val(),
        submittedBy: {
            ContactId: $('#loggedinuser').val(),
            
        },
        
    }

    $.ajax({
        type: "POST",
        url: "/Home/MeetingBooking",
        data: '{booking: ' + JSON.stringify(booking) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {


            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            $("#bookaroom-modal").modal("hide");
            setTimeout(function () {
                window.location.reload(true);
            }, 1000)
        }
    });


    
}


function PostEnableDisableRequest($this) {

    var building = {
        BuildingId: $($this).attr("id"),
        IsaccessibleLabel: $($this).attr("data-status")
    }
    $.ajax({
        type: "POST",
        url: "/Home/BlockEnableBuilding",
        data: '{building: ' + JSON.stringify(building) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {

            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            $("div .alert").html("Building Status has been Successfully Updated.");
            $("#message-notification").show();
            setTimeout(function () {
                window.location.reload(true);
            },1000)
            
        }
    });
}
function openModalDialog($this, modalname) {
    var Id = $($this).attr("id")
    $("#" + modalname).attr("data-roomId", Id);
    if ($($this).attr("data-action-type") == "bookroom") {
        //get the room data
        GetRoomRequest(Id);
    }

    else if ($($this).attr("data-action-type") == "viewroombooking") {

        PostGetBookingRoom(Id);
    }
    else {
        $("#" + modalname).modal("show");
    }
}

function PostBlockEnableRequest() {

    var Rooms = {
        RoomEntityId: $("#blockroom-modal").attr("data-roomId"),
        BlockDuration: parseInt($('#duration option:selected').val())
      }
    $.ajax({
        type: "POST",
        url: "/Home/BlockEnableMeetingRoom",
        data: '{meetingRoom: ' + JSON.stringify(Rooms) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                $("#blockroom-modal").modal("hide");
            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            $("#blockroom-modal").modal("hide");
            setTimeout(function () {
                window.location.reload(true);
            }, 1000)
        }
    });
}

function GetRoomRequest(id) {

    var Room = {
        RoomEntityId: id
    }
    
    $.ajax({
        type: "POST",
        url: "/Home/GetMeetingRoom",
        data: '{meetingRoom: ' + JSON.stringify(Room) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                
                $("#building").val(response.Building.BuildingId);
                $('#building').trigger("change");
                setTimeout(function () {
                    $("#room").prop('selectedIndex', response.RoomEntityId);
                    $("#bookaroom-modal").modal("show");
                },1000)
                
                
                
            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            $("#bookroom-modal").modal("hide");
            
        }
    });
}

function PostGetBookingRoom(id) {

    var RoomBooking = {
        BookingId: id
    }

    $.ajax({
        type: "POST",
        url: "/Home/GetBookingRoom",
        data: '{booking: ' + JSON.stringify(RoomBooking) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                //populate the modal form with data
                $('#subject').val(response.Subject).attr("disabled",true);
                $('#building').val(response.Building.BuildingId).attr("disabled", true);
                $('#building').trigger("change").attr("disabled", true);
                $("#room").prop('selectedIndex', response.Room.RoomEntityId).attr("disabled", true);
                $("#time").prop('selectedIndex', response.timeslot).attr("disabled", true);
                //var date = moment(response.FormattedStartdate, "yyyy-MM-dd");
                $("#startdatelabel").val(response.FormattedStartdate).attr("disabled", true).show();
                $("#startdate").hide(); 
                $('#submitbooking').hide();
                setTimeout(function () {
                   $("#bookaroom-modal").modal("show");
                }, 1000)



            }
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            $("#bookroom-modal").modal("hide");

        }
    });
}