const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/users/register', async (req, res) => {
    try {
    
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            // If user with the same email already exists, return an error
            return res.json({ status: "failure", message: 'User with the same email already exists.Use another email.' });
        }
        if (!req.body.name || !req.body.password || !req.body.role || !req.body.SIN || !req.body.email || !req.body.phone) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
          }

        const sinValidationResult = await validateSinWithThirdParty(req.body.SIN);
        console.log("sinValidationResult", sinValidationResult)


        if (sinValidationResult.success) {
            const userData = {
                name: req.body.name,
                password: req.body.password,
                role: req.body.role,
                SIN: req.body.SIN,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            };
            const newUser = await User.create(userData);

            res.json({ success: true, message: 'User registered successfully', user: newUser });
        } else {
            // Provide specific error messages for different scenarios
            if (sinValidationResult.reason === 'INVALID_SIN') {
                res.json({ success: false, message: 'SIN Validation Failed. Invalid SIN provided.' });
            } else if (sinValidationResult.reason === 'SIN_NOT_FOUND') {
                res.json({ success: false, message: 'SIN Validation Failed. SIN not found in the database.' });
            } else if (sinValidationResult.reason === 'NO_AGE') {
                res.json({ success: false, message: 'Age should be above 18+ . Unable to register' });
            } else {
                res.json({ success: false, message: 'SIN Validation Failed. Unable to register user details.' });
            }
        }

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Function to validate SIN with local dummy data
async function validateSinWithThirdParty(sin) {
    try {
        // Load dummy data from local file (dummyData.json)
        const dummyData = require("./dummyData.json");

        // Assuming dummy data is an array of objects with "SIN" and "age" properties
        const person = dummyData.find(item => item.SIN === sin);
        if (person) {
            if (person && person.age >= 18) {
                return { success: true };
            } else {
                return { success: false, reason: 'NO_AGE' };
            }

        } else if (!sin) {
            return { success: false, reason: 'INVALID_SIN' };
        } else {
            return { success: false, reason: 'SIN_NOT_FOUND' };
        }

    } catch (error) {
        console.error('Error during SIN validation: Enter valid SIN', error);
        return { success: false };
    }
}



module.exports = router;