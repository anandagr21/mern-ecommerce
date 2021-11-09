const express = require("express");
const router = express.Router();
const { authCheck } = require("../middlewares/auth");
const { userCart, getUserCart, emptyCart, saveAddress, applyCouponToUserCart, createOrder, orders, addToWishlist, wishlist, removeFromWishlist, createCashOrder } = require("../controllers/user")

router.get("/user", (req, res) => {
  res.json({ data: "Api hit user" });
});

router.post("/user/cart", authCheck, userCart)
router.get("/user/cart", authCheck, getUserCart)
router.delete("/user/cart", authCheck, emptyCart)
router.post("/user/address", authCheck, saveAddress)

router.post("/user/order", authCheck, createOrder) // stripe
router.post("/user/cash-order", authCheck, createCashOrder) // cash on delivery
router.get("/user/orders", authCheck, orders)

// coupon 
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart)

// wishlist 
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router;
