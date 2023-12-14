const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = (req, res, next) => {
  const auth_header = req.headers["authorization"];

  if (!auth_header) return res.sendStatus(403);

  const token = auth_header.split(" ")[1];
  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // invalid token

    console.log(decoded); // for correct token
    next();
  });
};

const checkRole = (roles) => async (req, res, next) => {
  const { username } = req.body;
  
  // retrieve user from DB
  const user = await User.findOne({ username });
  !roles.includes(user.role) ? res.status(401).json("Maaf kamu tidak mempunyai akses untuk halaman ini.") : next();
};

module.exports = {
  userAuth,
  checkRole,
};
