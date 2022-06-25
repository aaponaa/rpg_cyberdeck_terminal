const jwt = require("jsonwebtoken");
require('dotenv').config();

function VerifyToken(req, res, next){

    // check header or url parameters or post parameters for token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //

    if(!token){
        return res.sendStatus(401);
    }
    // verifies secret and checks exp
    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(401);
        }

        // if everything is good, save to request for use in other routes
        req.user = user;
        next();
    });
}

module.exports = VerifyToken;
