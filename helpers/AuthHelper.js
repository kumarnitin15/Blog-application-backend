const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");
const config = require("../config");

module.exports = {
    VerifyToken: (req, res, next) => {
        if(!req.headers.authorization)
            return res.status(HttpStatus.UNAUTHORIZED).json({message: 'User not authorized'});
        const token = req.headers.authorization.split(' ')[1];
        if(!token)
            return res.status(HttpStatus.FORBIDDEN).json({message: "No token provided"});
        jwt.verify(token, config.secret, (err,decoded) => {
            if(err)
                return res.status(HttpStatus.UNAUTHORIZED).json({message: 'Please login again'});
            req.user = decoded.data;
            next();
        });
    }
};