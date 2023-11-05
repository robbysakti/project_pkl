const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Authentification
const auth = async(req, res, next) => {
    try {
        // console.log(req);
        // console.log(req.header("Authorization"));

        if(!req.header("Authorization")) {
            throw new Error("Authorization not found");
        }
        const token = await req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "robby");
        
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token
        });

        if (!user) {
            throw new Error("Invalid token");
        }

        req.user = user;
        req.user.token = token;
        next();
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = auth;
