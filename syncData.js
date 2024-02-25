const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const ageVerify = require("./handler/ageVerify");
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoute');
const mongoose = require('mongoose');
const bookingRoutes = require('./handler/ticketBooking');
const organizeRoutes = require('./routes/organizerRoutes')

const { ObjectId } = require('mongoose').Types;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure Firebase credentials
const serviceAccount = require('./group3-f6a87-firebase-adminsdk-9eq44-f3716f1f11.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Configure connection to MongoDB
const mongoURI = process.env.DB_URL;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
    // Call the synchronization function
    syncData();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Initialize Firestore
const firestore = admin.firestore();

async function syncData() {
  try {
    // Fetch all Mongoose models
    const models = mongoose.modelNames();

    // Iterate over each model
    await Promise.all(
      models.map(async (modelName) => {
        // Select the Mongoose model
        const Model = mongoose.model(modelName);

        // Get documents from MongoDB using Mongoose model
        const mongodbData = await Model.find().lean().exec();

        // Save data to Firestore
        const firestoreCollection = firestore.collection(modelName.toLowerCase()); // Use the model name as the Firestore collection name
        await Promise.all(
          mongodbData.map(async (doc) => {
            // Convert MongoDB ObjectId to string
            const firestoreDoc = { ...doc, _id: doc._id.toString() };

            // Remove the original _id field
            delete firestoreDoc._id;

            // Check if a document with the same _id exists in Firestore
            const existingDoc = await firestoreCollection.doc(doc._id.toString()).get();

            // Compare the update date to determine if an update is necessary
            if (!existingDoc.exists || existingDoc.data().updatedAt < firestoreDoc.updatedAt) {
              // Add or update in Firestore only if it doesn't exist or if there is an update
              await firestoreCollection.doc(doc._id.toString()).set(firestoreDoc);
              console.log(`Document with _id ${doc._id.toString()} synchronized for model ${modelName}.`);
            } else {
              console.log(`Document with _id ${doc._id.toString()} is already updated in Firestore for model ${modelName}. Ignoring.`);
            }
          })
        );

        console.log(`Data synchronized successfully for model ${modelName}!`);
      })
    );

    console.log('All data synchronized successfully!');
  } catch (error) {
    console.error('Error during synchronization:', error);
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Authentication routes
app.use('/api', bookingRoutes, userRoutes, ageVerify, eventRoutes, organizeRoutes);

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to Concert Hub Online Booking');
});
