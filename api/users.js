const express = require('express');
const { models } = require('mongoose');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var bodyParser = require('body-parser')

require("dotenv").config

const nodemailer = require("nodemailer")
const cors = require('cors');

// Load User model
const User = require('../model/User');

// @route GET api/users/test
// @description tests users route
// @access Public
router.get('/test', (req, res) => res.send('user route testing!'));


// @route GET api/users
// @description Get all users
// @access Public
router.get('/',authenticateToken, (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ noUsersFound: 'No Users found' }));
});


router.post('/createAdmin', authenticateToken, (req, res) => {
  console.log(req.body);
  User.create({ ...req.body, isAdmin: "true" })
    .then(users => res.json({ msg: 'Admin added successfully' }))
    .catch(err => res.status(400).json({ error: err }));
});

router.post('/createUser', authenticateToken, (req, res) => {
  currEmail = req.body.email;
  console.log(currEmail);
  User.create({ ...req.body, isAdmin: "false" })
    .then(console.log('User added successfully'))
    .catch(err => res.status(400).json({ error: 'Unable to add User' }));

});

router.get('/search', authenticateToken, (req, res) => {
  User.find(req.query)
    .then(user => res.json(user))
    .catch(err => res.status(404).json({err}));
});


router.post('/send_mail', cors(), async (req, res) => {

  let { deptFlightId, retFlightId, deptFrom, deptTo, retFrom, retTo, refundedAmount, bookingNumber, to } = req.body
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }

  })

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: to,
    subject: "Reservation Cancellation ",
    html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>This mail is to confirm that you canceled your flight reservation. </h2>
        <h3>Departure Flight</h3>
        <div>
        <p>Flight ID: ${deptFlightId}</p>
        <p>From: ${deptFrom}</p>
        <p>To: ${deptTo}</p>
        <p></p>
        </div>
        <h3>Return Flight</h3>
        <div>
        <p>Flight ID: ${retFlightId}</p>
        <p>From: ${retFrom}</p>
        <p>To: ${retTo}</p>
        <p></p>
        </div>
        <h3>Amount refunded is  EGP<span style="color:blue; font-size:25px">${refundedAmount}</span> for booking number: <span style="font-size:25px">
        ${bookingNumber}</span> </h3>

    
        <p>All the best, Five clueless devs!</p>
         </div>
    `})
  //console.log("Message sent: %s", info.messageId);  
})

router.post('/send_mailRes', cors(), async (req, res) => {

  let { deptFlightId, retFlightId, deptFrom, deptTo, retFrom, retTo, refundedAmount, bookingNumber,
    departureDateDep, arrivalDateDep, departureTimeDep, arrivalTimeDep, departureTerminalDep, arrivalTerminalDep, cabinClassDep, seatsDep,
    departureDateRet, arrivalDateRet, departureTimeRet, arrivalTimeRet, departureTerminalRet, arrivalTerminalRet, cabinClassRet, seatsRet,
    firstName, lastName,
    to } = req.body
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }

  })

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: to,
    subject: "Itinerary ",
    html: `
  
    
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h1 > <span style="color:#59B39E; font-size:25px">Clueless Pilots Aviation</span></h1>
        <h2> <span style="font-style:italic"> Dear ${firstName} ${lastName}, this email is sent to you per your request with a copy of your itinerary found below. </span> </h2>
        <hr>
        <hr>
        <h2 style="fontStyle:italic;">Departure Flight:</h2>

       
        <div>
        
        
        <p>Flight ID: ${deptFlightId}</p>
        <p>From: ${deptFrom}</p>
        <p>To: ${deptTo}</p>
        <p>Departure Date: ${departureDateDep}</p>
        <p>Arrival Date: ${arrivalDateDep}</p>
        <p>Departure Time: ${departureTimeDep}</p>
        <p>Arrival Time: ${arrivalTimeDep}</p>
        <p>Departure Terminal: ${departureTerminalDep}</p>
        <p>Arrival Terminal: ${arrivalTerminalDep}</p>
        <p>Cabin Class: ${cabinClassDep}</p>
        <p>Seats: ${seatsDep}</p>
        <p></p>
        </div>
        <hr>
        <hr>
        <h2>Return Flight</h2>
        
        <div>
        <p>Flight ID: ${retFlightId}</p>
        <p>From: ${retFrom}</p>
        <p>To: ${retTo}</p>
        <p>Departure Date: ${departureDateRet}</p>
        <p>Arrival Date: ${arrivalDateRet}</p>
        <p>Departure Time: ${departureTimeRet}</p>
        <p>Arrival Time: ${arrivalTimeRet}</p>
        <p>Departure Terminal: ${departureTerminalRet}</p>
        <p>Arrival Terminal: ${arrivalTerminalRet}</p>
        <p>Cabin Class: ${cabinClassRet}</p>
        <p>Seats: ${seatsRet}</p>
        <p></p>
        </div>
        <hr>
        <h3> Booking Number: <span style="font-size:25px; color:blue">
        ${bookingNumber}</span> </h3>
    
        <p>Thank you for choosing Clueless Pilots Airlines. Have a safe flight!</p>
         </div>
    `})
  //console.log("Message sent: %s", info.messageId);  
})



router.post('/send_mailPay', cors(), async (req, res) => {

  let { deptFlightId, retFlightId, deptFrom, deptTo, retFrom, retTo,
    departureDateDep, arrivalDateDep, departureTimeDep, arrivalTimeDep, cabinClassDep,
    departureDateRet, arrivalDateRet, departureTimeRet, arrivalTimeRet, cabinClassRet,
    flightPriceDept, flightPriceRet, totalPrice, bookingNumber,
    firstName, lastName,
    to } = req.body
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }

  })

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: to,
    subject: "Payment Confirmation ",
    html: `
  
    
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h1 > <span style="color:#59B39E; font-size:25px">Clueless Pilots Aviation</span></h1>
        <h2> <span style="font-style:italic"> Dear ${firstName} ${lastName}, this email is sent to you to confirm your payment of EGP<span style="font-size:25px; color:blue">
        ${totalPrice}</span> </span> for your latest reservation </h2>
        <hr>
        <hr>
        <h2 style="fontStyle:italic;">Departure Flight:</h2>

       
        <div>
        
        
        <p>Flight ID: ${deptFlightId}</p>
        <p>From: ${deptFrom}</p>
        <p>To: ${deptTo}</p>
        <p>Departure Time and Date: ( ${departureTimeDep}) ,  ${departureDateDep} </p>
        <p>Arrival Time and Date: (${arrivalTimeDep}) , ${arrivalDateDep}</p>
        
        <p>Cabin Class: ${cabinClassDep}</p>
        <p>Flight Price: ${flightPriceDept}</p>
        
        <p></p>
        </div>
        <hr>
        <hr>
        <h2>Return Flight</h2>
        
        <div>
        <p>Flight ID: ${retFlightId}</p>
        <p>From: ${retFrom}</p>
        <p>To: ${retTo}</p>
        <p>Departure Time and Date: (${departureTimeRet}) , ${departureDateRet}</p>
        <p>Arrival Time and Date: (${arrivalTimeRet}) , ${arrivalDateRet}</p>
        
        <p>Cabin Class: ${cabinClassRet}</p>
        <p>Flight Price: ${flightPriceRet}</p>
        
        <p></p>
        </div>
        <hr>
        
        <h3> Booking Number: <span style="font-size:25px; color:blue">
        ${bookingNumber}</span> </h3>
        <p>Thank you for choosing Clueless Pilots Airlines. Have a safe flight!</p>
         </div>
    `})
  //console.log("Message sent: %s", info.messageId);  
})

router.post('/send_mailChange', cors(), async (req, res) => {

  let { deptFlightId, retFlightId, deptFrom, deptTo, retFrom, retTo,
    departureDateDep, arrivalDateDep, departureTimeDep, arrivalTimeDep, cabinClassDep,
    departureDateRet, arrivalDateRet, departureTimeRet, arrivalTimeRet, cabinClassRet,
    flightPriceDept, flightPriceRet, totalPrice, bookingNumber,
    firstName, lastName, yourPaymentOrARefund, refundedOrFee,
    to } = req.body
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }

  })

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: to,
    subject: "Reservation Update Confirmation ",
    html: `
  
    
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h1 > <span style="color:#59B39E; font-size:25px">Clueless Pilots Aviation</span></h1>
        <h2> <span style="font-style:italic"> Dear ${firstName} ${lastName}, this email is sent to you to confirm ${yourPaymentOrARefund} of EGP<span style="font-size:25px; color:blue">
        ${totalPrice}</span> </span> for your latest reservation update </h2>
        <hr>
        <hr>
        <h2 style="fontStyle:italic;">Departure Flight:</h2>

       
        <div>
        
        
        <p>Flight ID: ${deptFlightId}</p>
        <p>From: ${deptFrom}</p>
        <p>To: ${deptTo}</p>
        <p>Departure Time and Date: ( ${departureTimeDep}) ,  ${departureDateDep} </p>
        <p>Arrival Time and Date: (${arrivalTimeDep}) , ${arrivalDateDep}</p>
        
        <p>Cabin Class: ${cabinClassDep}</p>
        <p>${refundedOrFee}: ${flightPriceDept}</p>
        
        <p></p>
        </div>
        <hr>
        <hr>
        <h2>Return Flight</h2>
        
        <div>
        <p>Flight ID: ${retFlightId}</p>
        <p>From: ${retFrom}</p>
        <p>To: ${retTo}</p>
        <p>Departure Time and Date: (${departureTimeRet}) , ${departureDateRet}</p>
        <p>Arrival Time and Date: (${arrivalTimeRet}) , ${arrivalDateRet}</p>
        
        <p>Cabin Class: ${cabinClassRet}</p>
        <p>${refundedOrFee}: ${flightPriceRet}</p>
        
        <p></p>
        </div>
        <hr>
        
        <h3> Booking Number: <span style="font-size:25px; color:blue">
        ${bookingNumber}</span> </h3>
        <p>Thank you for choosing Clueless Pilots Airlines. Have a safe flight!</p>
         </div>
    `})
  //console.log("Message sent: %s", info.messageId);  
})


router.put('/update', async (req, res) => {
  let { userId } = req.body
  //console.log(req.body._id)
  //console.log(req.query)
  const takenEmail = await User.findOne({ email: req.body.email })

  const takenEmail2 = await User.findOne({ _id: req.body._id })

 // console.log(takenEmail.email)
  //console.log(takenEmail2.email)

  if (takenEmail && takenEmail.email != takenEmail2.email) {//&&takenEmail!=JSON.parse(localStorage.getItem('user'))?.email){
    res.json({ message: "Email has already been taken" })
  }

  else {
    User.findOneAndUpdate(req.query, req.body)
      .then(res.status(200).json("updated succesfully"))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database' })
      );
  }

});

router.post('/register', async (req, res) => {
  const user = req.body;

  //const takenUsername = await User.findOne({ username: user.username })
  const takenEmail = await User.findOne({ email: user.email })

  if (takenEmail) {
    res.json({ message: "email taken" })
  } else {
    user.password = await bcrypt.hash(req.body.password, 10)

    User.create({ ...user, isAdmin: "false" })
      .then((newUser) =>
        res.json({ message: "User added", data: newUser, status: 'ok' })
      )
  }
})

router.post("/login", (req, res) => {
  const userLoggingIn = req.body;
  //console.log(req.body)
  User.findOne({ email: userLoggingIn.email }).then((user) => {
    if (!user) {
      return res.json({ message: "Invalid Username or Password" });
    }
    console.log(user);
    bcrypt
      .compare(userLoggingIn.password, user.password)
      .then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: user.userId,
            username: user.username,
            isAdmin: user.isAdmin
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "10h" },
            (err, token) => {
              if (err) {
                return res.json({ message: "error" });
              }
              return res.json({ message: "Success", token: "Bearer " + token, user: user });
            }
          );
        } else {
          res.json({ message: "Invalid Username or Password" });
        }
      });
  });
});
router.put('/changePass', authenticateToken, async (req, res) => {
  console.log("here");
  const currUser = req.body.email;
  // console.log(req.body.userId)
  User.findOne({ email: currUser }).then((user) => {
    // console.log(user);
    bcrypt
      .compare(req.body.oldpassword, user.password)
      .then(async (isCorrect) => {
        if (isCorrect) {
          let newpassword = await bcrypt.hash(req.body.Newpassword, 10)
          User.findOneAndUpdate({ email: user.email }, { password: newpassword })
            .then(res.status(200).json("updated succesfully"))
            .catch(err =>
              res.status(400).json({ error: 'Unable to update the Database' })
            );
        } else {
          res.json({ message: "Invalid Password" });
        }
      });
  });
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


module.exports = router;