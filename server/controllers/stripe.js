const User = require("../models/user");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Product = require("../models/product");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    // later apply coupon
    const { couponApplied } = req.body;
    // later calc price 

    // 1. find user
    const user = await User.findOne({ email: req.user.email }).exec();
    // 2. get cart total
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderedBy: user._id }).exec();

    // create payment intent with amount and currency
    const stripeCustomer = await stripe.customers.create({
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })

    let finalAmount = 0;
    if (couponApplied && totalAfterDiscount) {
        finalAmount = Math.round(totalAfterDiscount * 100)
    } else {
        finalAmount = Math.round(cartTotal * 100)
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount * 100,
        currency: "inr",
        description: "Software development services",
        customer: stripeCustomer.id
    });

    res.json({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount
    })
}
