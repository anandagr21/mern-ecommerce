const admin = require("../firebase/index.js");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  //   console.log(req.headers);
  // console.log("middlewares", admin);

  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);

    // console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ err: "Invalid or expired token" });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email: email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({ err: "Admin resource. Access denied" });
  } else {
    next();
  }
};
