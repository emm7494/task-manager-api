const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    console.log("inside auth...");
    //console.log(req.header('Authorization'));
    const token = req.header("Authorization").replace("Bearer ", "");
    //console.log('token',token);
    const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      _id: _id,
      "tokens.token": token
    });
    // console.log(user);
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate!!!" });
  }
};

module.exports = auth;
