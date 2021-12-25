//all fields will be enforced in frontend

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    homeAddress: {
        type: String
    },
    countryCode: {
        type: String
    },
    telephone: {
        type: [String]
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    passportNumber: {
        type: String
    },
    isAdmin:{
        type: Boolean,
        required: true
    }
});

module.exports = User = mongoose.model('user', UserSchema);