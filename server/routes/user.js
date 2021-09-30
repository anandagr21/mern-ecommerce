const express = require("express");
const router = express.Router();
const { authCheck } = require("../middlewares/auth");
const { userCart, getUserCart, emptyCart, saveAddress } = require("../controllers/user")

router.get("/user", (req, res) => {
  res.json({ data: "Api hit user" });
});

router.post("/user/cart", authCheck, userCart)
router.get("/user/cart", authCheck, getUserCart)
router.delete("/user/cart", authCheck, emptyCart)
router.post("/user/address", authCheck, saveAddress)

module.exports = router;
