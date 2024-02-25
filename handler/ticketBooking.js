const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables
router.use(bodyParser.json());
const autenticate = require('./autenticate');
const Booking = require('../models/bookingModel')
const User = require('../models/userModel')
const Event = require('../models/eventModel')



router.post('/booking', autenticate, async (req, res) => {
  try {
    const allowedNumTickets = [1, 2, 3, 4];
    //const requestedNumTickets = req.body.numTickets;

    if (!allowedNumTickets.includes(req.body.numTickets)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid value for numTickets. It must be 1, 2, 3, or 4.',
      });
    }
    // Verify the existence of the user
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify the existence of the event
    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const bookingData = new Booking({
      userId: req.body.userId,
      eventId: req.body.eventId,
      numTickets: req.body.numTickets,
      email: req.body.email,
      bookedTickets: req.body.bookedTickets,

    });


    // Fetch original price from another API using the eventId
    const originalPrice = await getOriginalPrice(bookingData.eventId);
    console.log("original price ", originalPrice)
    if (originalPrice === null) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Calculate total cost with dynamic pricing
    // const bookingPercentage = (bookingData.bookedTickets / bookingData.numTickets) * 100;
    let ticketPrice = originalPrice;

    if (bookingData.bookedTickets >= 90) {
      ticketPrice += originalPrice * 0.15; // 15% increase
    } else if (bookingData.bookedTickets >= 80) {
      ticketPrice += originalPrice * 0.1; // 10% increase
    } else if (bookingData.bookedTickets >= 70) {
      ticketPrice += originalPrice * 0.05; // 5% increase
    }

    const totalCost = ticketPrice * bookingData.numTickets;
    console.log("total cost ", totalCost)

    // Generate a confirmation code
    const confirmationCode = generateConfirmationCode();
    console.log("confirmationCode", confirmationCode)


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Add this line with your email password
      },
      debug: true,
    });


    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: bookingData.email,
      subject: 'Ticket Booking Confirmation',
      html: `  <div style="text-align: center;">
      <p style="font-size: 24px; font-weight: bold;">Thanks for choosing Concert Hub! Your ticket booking is confirmed 😊</p>
      <p style="font-size: 18px;">Confirmation Code: <strong>${confirmationCode}</strong></p>
      <p style="font-size: 18px;">No. of Tickets: <strong>${bookingData.numTickets}</strong></p>
      <p style="font-size: 18px;">Total Cost: <strong>$${totalCost.toFixed(2)}</strong></p>
    </div>`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    bookingData.totalCost = totalCost;
    bookingData.confirmationCode = confirmationCode;
    bookingData.originalPrice = originalPrice;

    const data = await bookingData.save();
    // Prepare the response body
    const response = {
      success: true,
      message: 'Booking successful',
      bookingDetails: {
        eventId: data.eventId,
        numTickets: data.numTickets,
        email: data.email,
        totalCost,
        originalPrice,
        confirmationCode
      }
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


async function getOriginalPrice(eventId) {
  try {
    // Replace the URL with the actual endpoint of the API that provides original prices
    const response = await axios.get(`http://localhost:3000/api/events/${eventId}`);
    console.log("response data", response.data)
    console.log("response data TICKET COST ", response.data.event.ticketCost)
    return response.data.event.ticketCost;
  } catch (error) {
    console.error(error);
    return null; // Return null if there's an error or event not found
  }
}

function generateConfirmationCode() {
  // Your logic for generating a confirmation code
  // For simplicity, let's generate a random string
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 8;
  let confirmationCode = '';
  for (let i = 0; i < codeLength; i++) {
    confirmationCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return confirmationCode;
}

module.exports = router