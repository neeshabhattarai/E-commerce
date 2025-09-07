const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  try {
    if(req.method=="OPTIONS"){
     return next();
    }
    const authHeader = req.headers["authorization" || "Authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    jwt.verify(token, process.env.Secret_Key, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Token is not valid" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = Auth;
