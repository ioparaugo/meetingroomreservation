using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MeetingRoomReservation.Service;
using MeetingRoomReservation.Service.CRMEntityModel;
using Microsoft.Xrm.Tooling.Connector;

namespace MeetingRoomReservation.Web.Controllers
{
    
    public class HomeController : Controller
    {
       
        public ActionResult Index()
        {
           
            

            return View();
        }


        public ActionResult Employee()
        {
            string viewuri = "Index";
            Contact user = null;
            if (Request.Form.Count > 0)
            {
                var email = Request.Form.Get("email");
                var password = Request.Form.Get("passwrd");
                user = CRMOperations.UserLogin(email, password);
                // call CRM Operation to get the login the User
                if (user != null)
                {
                    ViewBag.FirstName = user.FirstName; ViewBag.LastName = user.LastName;
                    ViewBag.User = user;
                    //Get all available rooms
                   List<Rooms> listofmeetingrooms = CRMOperations.GetMeetingRooms();
                    if(listofmeetingrooms!=null && listofmeetingrooms.Count>0)
                    {
                        ViewBag.MeetingRooms = listofmeetingrooms;
                    }

                    //Get the Bookings of the user
                    List<RoomBooking> userBookings = CRMOperations.GetMyRoomBookings(user.ContactId);
                    if (userBookings != null && userBookings.Count > 0)
                    {
                        ViewBag.UserBookings = userBookings;
                        
                    }

                    //Get avaliable buildings
                     var buildingList  = FetchAvailableBuildings(string.Empty);
                    if(buildingList!=null && buildingList.Count > 0)
                    {
                        ViewBag.Buildings = buildingList;
                    }

                    //Get all buildings if user is an admin
                    if(user.PortalRole.RoleName =="Admin")
                    {
                        var allbuildings = FetchAvailableBuildings("all");
                        if (allbuildings != null && allbuildings.Count > 0)
                        {
                            ViewBag.AllBuildings = allbuildings;
                        }
                    }
                    
                    viewuri = "Employee";
                }
                else
                {
                    viewuri = "Error";
                }
            }


            return View(viewuri);
        }

        [HttpPost]
       public string CreateUser(Contact user)
        {
            string userId = null;


            if (user != null)
            {
                switch (Convert.ToInt32(user.portaluserType))
                {
                    case 1:
                        {
                            user.portaluserType = UserType.AdminStaff;
                        }
                        break;

                    case 2:
                        {
                            user.portaluserType = UserType.Employee;
                        }
                        break;

                    case 3:
                        {
                            user.portaluserType = UserType.ServiceStaff;
                        }
                        break;
                }

               userId = CRMOperations.CreateUser(user).ToString();
                // call CRM Operation to get the login the User
                if (!string.IsNullOrEmpty(userId))
                {

                    ViewBag.FirstName = user.FirstName; ViewBag.LastName = user.LastName;
                    
                }
                else
                {
                    
                }
            }


            return userId;
        }
        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public string MeetingBooking(RoomBooking booking)
        {
            string bookingid;
            bookingid =  CRMOperations.CreateRoomBookingRecord(booking).ToString();

            return bookingid;
        }

        [HttpPost]
        public JsonResult GetRooms(string id)
        {
            var rooms = CRMOperations.GetMeetingRoomsByBuildingId(id);
            if (rooms != null)
            {
                return Json(rooms);
            }
            else
            {
                return null;
            }
            
        }

        [HttpPost]
        public JsonResult GetMeetingRoom(Rooms meetingRoom)
        {

            var r = CRMOperations.GetMeetingRoomById(meetingRoom.RoomEntityId.ToString());
            if (r != null)
            {
                return Json(r);
            }
            else
            {
                return null;
            }

        }


        [HttpPost]
        public JsonResult GetBookingRoom(RoomBooking booking)
        {

            var r = CRMOperations.GetBookingById(booking.BookingId.ToString());
            if (r != null)
            {
                return Json(r);
            }
            else
            {
                return null;
            }

        }
        public List<Buildings> FetchAvailableBuildings(string queryType)
        {
            try
            {
                return CRMOperations.GetBuildings(queryType);
            }
            catch(Exception e) { throw new Exception(e.Message); }
        }

        [HttpPost]
        public string BlockEnableBuilding(Buildings building)
        {
            string buildingId = building.BuildingId.ToString();
            string state = building.IsaccessibleLabel=="Accessible"?"Disable":"Enable";
            return CRMOperations.DisableEnableBuilding(buildingId, state);
        }

        [HttpPost]
        public string BlockEnableMeetingRoom(Rooms meetingRoom)
        {
            string roomId = meetingRoom.RoomEntityId.ToString();
            int duration = meetingRoom.BlockDuration;
            return CRMOperations.BlockEnableMeetingRoom(roomId, duration);
        }


    }
}