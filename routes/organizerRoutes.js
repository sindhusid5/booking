const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Organiser = require('../models/organizerModel');
const Event = require('../models/eventModel');
const autenticate = require('../handler/autenticate');

router.post('/organizer/register', async (req, res) => {
  try {
    // Data provided in the request body

    // Logic to check if all required fields are present
    if (!req.body.organizerName || !req.body.password || !req.body.role || !req.body.email || !req.body.phone) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }
    // Logic to check if the organizer is already registered
    const existingOrganizer = await Organiser.findOne({ email: req.body.email });
    if (existingOrganizer) {
      return res.status(400).json({ success: false, message: 'Organizer with this email is already registered' });
    }
    console.log('existing one ', existingOrganizer)
    // Create a new organizer
    const newOrganizer = new Organiser({
      organizerName: req.body.organizerName,
      password: req.body.password,
      role: req.body.role,
      email: req.body.email,
      phone: req.body.phone,
    });

    // Save the new organizer to the database
    const savedOrganizer = await newOrganizer.save();

    console.log("Registered organizer: ", savedOrganizer);

    // Respond with success
    res.json({ success: true, message: 'Organizer successfully registered', data: savedOrganizer });
  } catch (error) {
    console.error("Error registering organizer:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



// Login and generate a JWT token
router.post('/organizer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const organiser = await Organiser.findOne({ email: req.body.email });

    if (!organiser) {
      return res.json({
        status: "failure",
        message: 'organizer not found. Register first.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, organiser.password);

    if (!isPasswordValid) {
      return res.json({
        status: "failure",
        message: 'Invalid Credential.'
      });
    }

    const token = jwt.sign({ organizerId: organiser._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/organizer/events/:organizerId', autenticate, async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    const organizer = await Organiser.findById(organizerId);

    if (!organizer) {
      return res.status(404).json({ success: false, message: 'Organizer not found' });
    }

    // Fetch events associated with the organizer
    const events = await Event.find({ organizerId });

    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



router.get('/organizer',autenticate, async (req, res) => {
  try {
    const organise = await Organiser.find();

    res.json({
      status: "success",
      message: 'Event details retrieved successfully',
      organise,
    });
  } catch (error) {
    console.error('Error retrieving organizer details:', error);
    res.json({
      status: "failure",
      message: 'Internal server error'
    });
  }
});

router.post('/organizer/logout', autenticate, (req, res) => {
  // Check if the Authorization header is present
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  // Return a successful response
  return res.json({ message: 'Organizer logged out successfully' });
});

module.exports = router;
