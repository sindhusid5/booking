const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({

    organizerId: {
        type: String,
        required: true
    },

    eventType: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    venue: {
        type: String,
        required: true
    },

    showName: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
       //type:String,
        required: true
    },

    totalTickets: {
        type: Number,
        required: true
    },

    ticketCost: {
        type: Number,
        required: true
    },
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
