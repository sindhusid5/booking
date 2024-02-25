const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const Organizer = require('../models/organizerModel')
const autenticate = require('../handler/autenticate')
const Booking = require('../models/bookingModel')

// Route to create a new event
router.post('/events/create', autenticate, async (req, res) => {
    try {
        const organizer = await Organizer.findById(req.body._id);
 
        if (!organizer) {
            return res.json({
                status: 'failure',
                message: 'Organizer with the provided ID not found',
            });
        }
        const inputDate = req.body.date;
        const parsedDate = new Date(inputDate);

        // Check if the parsed date is valid
        if (isNaN(parsedDate.getTime())) {
            return res.json({
                status: 'failure',
                message: 'Invalid date format',
            });
        }
        // Create a new Event instance with data from the request body
        const newEvent = new Event({
            organizerId: req.body._id,
            eventType: req.body.eventType,
            location: req.body.location,
            venue: req.body.venue,
            showName: req.body.showName,
            time: req.body.time,
            date: parsedDate,
            totalTickets: req.body.totalTickets,
            ticketCost: req.body.ticketCost,
        });

        // Save the new event to the database
        const savedEvent = await newEvent.save();

        console.log('event ', savedEvent);

        res.json({
            status: 'success',
            message: 'Event created successfully',
            event: savedEvent,
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.json({
            status: 'failure',
            message: 'Internal server error',
        });
    }
});



// Route to get event details based on event ID
router.get('/events/:eventId', autenticate, async (req, res) => {
    try {
        // Retrieve event details from the database using the event ID
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({
                status: "failure",
                message: 'Event not found',
            });
        }

        res.json({
            status: "success",
            message: 'Event details retrieved successfully',
            event,
        });
    } catch (error) {
        console.error('Error retrieving event details:', error);
        res.json({
            status: "failure",
            message: 'Internal server error'
        });
    }
});

// Route to get event details based on event ID
router.get('/user/events',autenticate, async (req, res) => {
    try {
        // Retrieve event details from the database using the event ID
        const event = await Event.find();


        res.json({
            status: "success",
            message: 'Event details retrieved successfully',
            event,
        });
    } catch (error) {
        console.error('Error retrieving event details:', error);
        res.json({
            status: "failure",
            message: 'Internal server error'
        });
    }
});

router.get('/organizer/events/:eventId/bookings',autenticate, async (req, res) => {
    try {
        const eventId = req.params.eventId;

        const bookings = await Booking.find({ eventId });

        console.log("booking data ", bookings)

        if ((!bookings || bookings.length === 0)) {
            return res.json({ status: "failure", message: "Booking details not found" });
        }
        res.json({ status: "success", data: bookings });


    } catch (error) {
        console.error('Error retrieving bookings:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



// Define the API endpoint for event search
router.get('/event/search/:location/:date', autenticate, async (req, res) => {
    try {
        const { location, date } = req.params;

        // Parse the date parameter into a JavaScript Date object
        const searchDate = new Date(date);

        // Find events matching the date
        const events = await Event.find({ location, date: searchDate });

        console.log("Events:", events);
        if ((!events || events.length === 0)) {
            return res.json({ status: "failure", message: "Search event not found" });
        }
        // Return the events in the response
        res.json({ status: 'success', data: events });
    } catch (error) {
        // Handle errors
        console.error('Error searching for events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
