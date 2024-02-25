// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  
  
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true, 
    unique: true 
  },

  password: {
    type: String, 
    required: true 
  },

  SIN:{
    type: Number,
    required: true
  },

  role:{
    type: String
   // default: "user"
  },

  address: {
    type: String,
    required: true
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
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
  
const user = mongoose.model('user', userSchema);

module.exports = user;
    
 
