const express = require('express');
const { models } = require('mongoose');
const router = express.Router();
const jwt = require("jsonwebtoken");

// Load User model
const Flight = require('../model/Flight');

// @route GET api/flights/test
// @description tests users route
// @access Public
router.get('/test', (req, res) => res.json({ "res": "123" }));

// POST: Create a flight
router.post('/createFlight', authenticateTokenAdmin, (req, res) => {
    console.log('YOU ADDED A FLIGHT');
    Flight.create({ ...req.body })
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ error: 'Unable to add flight' }));
});

//GET: Search for a flight
router.get('/search', (req, res) => {
    Flight.find(req.query)
        .then(flight => res.json(flight))
        .catch(err => res.status(404).json({ nobookfound: 'No flights found' }));
});
router.get('/searchUser', (req, res) => {
    const queryObj = { ...req.query };
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne)\b/g, match => `$${match}`);
    Flight.find(JSON.parse(queryStr))
        .then(flight => res.json(flight))
        .catch(err => res.status(404).json({ nobookfound: 'No flights found' }));
});
//PUT: Update flight details
router.put('/update', authenticateToken, (req, res) => {
    Flight.findOneAndUpdate(req.query, req.body)
        .then(book => res.json(book))
        .catch(err =>
            res.status(400).json({ error: 'Unable to update the Database' })
        );
});
//DELETE :Delete a flight
router.delete('/deleteFlight', authenticateTokenAdmin, (req, res) => {
    Flight.deleteOne({ ...req.query })
        .then(flight => res.json(flight))
        .catch(err => res.status(404).json(err));
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) res.sendStatus(403);
        req.user = user
        next()
    })
}

function authenticateTokenAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(user);
        if (err || user.isAdmin == false) {
            res.sendStatus(403);
        } else {
            req.user = user
            next()
        }
    })
}



module.exports = router;