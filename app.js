const express = require('express');

const connectDB = require('./config/db.js');

const app = express();

const cors = require('cors');

//const stripe = require('stripe')('sk_test_51K9D6UA32Adg2XeIHSgKlwhQv8iuS235SFa3utAxVVdyj6NSHN1O9Feh2mZXnaMd3Z3YTFrIjwTCI9AWwdYEclG200bdSXDFyd////'); // Add your Secret Key Here
//const uuid = require("uuid/v4");



// Connect Database
connectDB();


const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }));


app.get('/', (req, res) => res.send('Hello world!'));

//const bookRouter = require("./api/books")
//app.use("/api/books", bookRouter);

const userRouter = require('./api/users');
app.use('/api/users', userRouter);

const flightRouter = require('./api/flights');
app.use('/api/flights', flightRouter);

const reservationRouter = require('./api/reservations');
app.use('/api/reservations', reservationRouter);

const paymentRouter = require('./api/payments');
app.use('/api/payments', paymentRouter);


// const stripe = require("stripe")("sk_test_51K9D6UA32Adg2XeIHSgKlwhQv8iuS235SFa3utAxVVdyj6NSHN1O9Feh2mZXnaMd3Z3YTFrIjwTCI9AWwdYEclG200bdSXDFyd");
// const { v4: uuid } = require("uuid");

// app.post("/payment", (req, res) => {
//     const { product, token } = req.body;
//     const idempontencyKey = uuid()
//     return stripe.customers.create({
//         email: token.email,
//         source: token.id
//     }).then(customer => {
//         console.log(customer);
//         console.log(" ");
//         stripe.charges.create({
//             amount: product.price * 100,
//             currency: 'egp',
//             customer: customer.id,
//             receipt_email: token.email,
//             description: product.name
//         })
//             .then(result => res.status(200).json(result))
//             .catch(err => { console.log(err); res.sendStatus(err.statusCode) })
//     }).catch(err => { console.log(err); res.sendStatus(err.statusCode) })
// });



// app.post("/refund", (req, res) => {
//     const { amount, chargeId } = req.body;
//     const idempontencyKey = uuid()
//     let payload;
//     if (amount) {
//         payload = {
//             charge: chargeId,
//             amount: (100 * amount).toFixed(0),
//         }
//     } else {
//         payload = {
//             charge: chargeId,
//         }
//     }
//     return stripe.refunds.create(payload).then(result => res.status(200).json(result))
//         .catch(err => { console.log(err); res.sendStatus(err.statusCode) })
// });


// app.post("/paymentUpdate", (req, res) => {
//     const { amount, chargeId } = req.body;
//     const idempontencyKey = uuid()
//     return stripe.charges.update(chargeId, { amount: (100 * amount).toFixed(0) })
//         .then(result => res.status(200).json(result))
//         .catch(err => { console.log(err); res.sendStatus(err.statusCode) })
// });




const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

// module.exports = app;