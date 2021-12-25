const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
    flightId: {
        type: String,
        required: true,
        unique: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    arrivalDate: {
        type: Date,
        required: true
    },

    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    availableEconomy: {
        type: Number,
        required: true
    },
    availableBusiness: {
        type: Number,
        required: true
    },
    availableFirst: {
        type: Number,
        required: true
    },
    arrivalTerminal: {
        type: String,
        required: true
    },
    departureTerminal: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    baggageAllowance: {
        type: String,
        required: true
    },
    seatsEconomy: {
        type: [String],
        required: true
    },
    seatsBusiness: {
        type: [String],
        required: true
    },
    seatsFirst: {
        type: [String],
        required: true
    },
    duration: {
        type: String,
        required: false
    },
});

module.exports = Flight = mongoose.model('flight', FlightSchema);