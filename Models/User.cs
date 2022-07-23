using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MeetingRoomReservation.Web.Models
{
    public class User
    {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string EmailAddress { get; set; }
            public string PhoneNumber { get; set; }
            public string Password { get; set; }
            public string Department { get; set; }
            public UserType portaluserType { get; set; }
            public string ContactId { get; set; }
         }


        public enum UserType
        {
            AdminStaff = 1,
            Employee = 2,
            ServiceStaff = 3
        }
    }
