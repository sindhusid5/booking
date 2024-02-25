const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        // required: true,
    },
    eventId: {
        type: String,
        required: true,
        //  type: mongoose.Schema.Types.ObjectId,
        // ref: 'Event',
        // required: true,
    },
    numTickets: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    bookedTickets: {
        type: Number,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    confirmationCode: {
        type: String,
        required: true,
    },
    originalPrice: {
        type: Number,
      //  required: true,
    },
});


const booking = mongoose.model('booking', bookingSchema)

module.exports = booking;