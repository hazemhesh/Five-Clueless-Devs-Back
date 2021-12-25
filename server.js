const cors = require("cors");
const express = require("express");

const stripe = require("stripe")("sk_test_51K9D6UA32Adg2XeIHSgKlwhQv8iuS235SFa3utAxVVdyj6NSHN1O9Feh2mZXnaMd3Z3YTFrIjwTCI9AWwdYEclG200bdSXDFyd");
const uuid = require("uuid");

const app= express();
app.use(express.json());
app.use(cors());

app.post("/payment/payment",(req,res)=> {
  const {product,token} = req.body;
  console.log("PRODUCT",product);
  console.log("PRICE",product.price);
  const idempontencyKey = uuid()

  return stripe.customers.create({
    email: token.email,
    source: token.id
  }).then(customer=>{
    stripe.charges.create({
      amount: product.price* 100,
      currency:'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: product.name
    },{idempontencyKey})
  })
  .then(result => res.status(200).json(result))
  .catch(err => console.log(err))
});


app.listen(5000,() => console.log("listening at port 5000"));
