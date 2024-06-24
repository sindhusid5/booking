 
# NodeJS with NoSQL

## Use Case Identification

1. **Role:**
   - User
   - Event-Organizer

2. **User Registration:**
   - Users registering with the system must be at least 18 years old.

3. **Event Creation by Organizer:**
   - Event organizers can create events, define venue details, dates, available ticket quantity, and initial ticket prices.

4. **User Ticket Booking:**
   - Users can browse and book event tickets based on location and date.

5. **Dynamic Ticket Pricing:**
   - Event organizers can adjust ticket prices dynamically:
     - 70% booked: 5% increase from the original price.
     - 80% booked: 10% increase from the original price.
     - 90% booked: 15% increase from the original price.

6. **Booking Limits for Users:**
   - Each user is limited to booking a maximum of 4 tickets per account.

7. **Confirmation Email:**
   - Upon successful ticket booking, users receive a confirmation email with details regarding their reserved seats for the event.

## MongoDB ↔ Firestore Data Sync

This script automates the synchronization of data between MongoDB and Firestore. It connects to a MongoDB database, retrieves data from a specified collection, and ensures synchronization with a corresponding Firestore collection. The script is designed to keep both databases up-to-date.

### Prerequisites

Before running the script, ensure you have the following:

- Node.js installed on your machine
- MongoDB instance running locally or accessible via a connection string
- Firebase project with Firestore enabled and a service account JSON file
- Postman (for testing the API)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sindhusid5/booking.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd booking
   ```

3. **Install the necessary dependencies:**

   ```bash
   npm install
   ```

4. **Run the synchronization script:**

   ```bash
   node syncData.js
   ```

By following these steps, you will set up the environment and run the script to synchronize data between MongoDB and Firestore.
