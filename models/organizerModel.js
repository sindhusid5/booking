// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const organizerSchema = new mongoose.Schema({

    organizerName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },


    role: {
        type: String
        // default: "user"
    },

    phone: {
        type: Number,
        required: true

    },

    createdAt: {
        type: Date,
        default: new Date()
    },


    isActive: {
        type: Boolean,
        default: true
    },

});

// Hash the password before saving
organizerSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const organizer = mongoose.model('organizer', organizerSchema);

module.exports = organizer;


