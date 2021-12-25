const express = require('express');
const { models } = require('mongoose');
const router = express.Router();
var bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")


// Load User model
const Reservations = require('../model/Reservations');

// @route GET api/users/test
// @description tests users route
// @access Public
router.get('/test', (req, res) => res.send('reservation route testing!'));

router.post('/createReservation', (req, res) => {
    console.log('YOU ADDED A Reservation');
    Reservations.create({ ...req.body })
        .then(Reservations => res.json(Reservations))
        .catch(err => res.status(400).json({ error: 'Unable to add reservation' }));
});
router.delete('/cancelReservation', (req, res) => {
    Reservations.deleteOne({ ...req.query })
        .then(Reservations => res.json(Reservations))
        .catch(err => res.status(404).json(err));
});
router.get('/GetReservation', authenticateToken, (req, res) => {
    Reservations.find(req.query)
        .then(Reservations => res.json(Reservations))
        .catch(err => res.status(404).json({ noreservationfound: 'No Reservation found' }));
});

router.put('/update',authenticateToken, (req, res) => {
    Reservations.findOneAndUpdate(req.query, req.body)
        .then(reservation => res.json(reservation))
        .catch(err =>
            res.status(400).json({ error: 'Unable to update the reservation' })
        );
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
  
    if(!token) res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
      if(err) res.sendStatus(403);
      req.user = user
      next()
    })
  }


module.exports = router;