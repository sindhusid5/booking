# MongoDB ↔ Firestore Data Sync

This script automates the synchronization of data between MongoDB and Firestore. It connects to a MongoDB database, retrieves data from a specified collection, and ensures synchronization with a corresponding Firestore collection. The script is designed to keep both databases up-to-date.

## Prerequisites

Before running the script, ensure you have the following prerequisites:

- Node.js installed on your machine
- MongoDB instance running locally or accessible via a connection string
- Firebase project with Firestore enabled and a service account JSON file

## Installation

Step 1:
 git clone https://github.com/sindhusid5/group3.git

Step 2;
 cd group3

Step 3;
 npm install

Step 4;
 node syncData.js 

Step 5:
 Test the API using Postman

1. Welcome message
 Method: GET
 API: http://localhost:3000/  
 
 2. User Register
 Method: POST
 API:  http://localhost:3000/api/users/register  
 Body {
    "name": "ALICE",
    "password": 1234,
    "role": "user",
    "SIN":  787016936,
    "email": "alice@gmail.com",
    "phone": 21313123131,
    "address": "5, Neilson Road, M13 54S"
 }

 3. User Login
 Method: POST
 API: http://localhost:3000/api/users/login  
 Body {
    "email": "alice@gmail.com",
    "password": "1234"
 }

4. Organizer Register
 Method: POST
 API: http://localhost:3000/api/users/register 
  Body {
    "organizerName": "ATOS",
    "password": "1234",
    "role": "organizer",
    "email": "a@gmail.com",
    "phone": 9222213131
   }

5. Organizer Login
 Method: POST
 API: http://localhost:3000/api/organizer/login  
 Body {
    "email": "a@gmail.com",
    "password": "1234"
 }

6. Create Event
 Method: POST
 API: http://localhost:3000/api/events/create  
 Header: Authorization
  Body {
    "_id": "65baf7677abbec469fa098f5",  //organizerId
    "eventType": "POP",
    "location": "toronto",
    "venue": "private hall",
    "showName": "Shift",
    "date": "2023-1-1",
    "time": "05:30",
    "totalTickets": 1000,
    "ticketCost": 200
}

7. Ticket Booking
   Method: POST
   API: http://localhost:3000/api/booking
   Header: Authorization
    Body {
    "userId": "65baf6ce7abbec469fa098f1",     //userId
    "eventId": "65baf8787abbec469fa0991e",   //eventId
    "numTickets": 4,
    "email": "<your_email>",           //any email to receive the confirmation email 
    "bookedTickets":90
}

8. Get All Users
   Method: GET
   API:http://localhost:3000/api/users

9. Get All Events
   Method: GET
   API:http://localhost:3000/api/user/events

10. Get All  Organizers
   Method: GET
   API:http://localhost:3000/api/organizer

11. Get Event based on Org Id
   Method: GET
   API:http://localhost:3000/api/organizer/events/:orgId

12. Get Event based on Event Id
   Method: GET
   API:http://localhost:3000/api/events/eventId

13. Search Events based on Location and Date
   Method: GET
   API:http://localhost:3000/api/event/search/:location/:date

14. View Booked event by Event Id
   Method: GET
   API:http://localhost:3000/api/organizer/events/:eventId/bookings

15. Delete user
   Method: DELETE
   API:http://localhost:3000/api/users/:userId

16. Deactivate User
   Method: PUT
   API:http://localhost:3000/api/users/update/:userId
    Body {
    "isActive": false
    }

17. User Logout
   Method: POST
   Header: Authorization
   API:http://localhost:3000/api/users/logout

18. Organizer Logout
   Method: POST
   Header: Authorization
   API:http://localhost:3000/api/organizer/logout

19. Forget Password
    Method: POST
    API:http://localhost:3000/api/forgetPassword
    Body {
    "email": "alice@gmail.com"
    }
