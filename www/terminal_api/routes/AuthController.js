const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const VerifyToken = require("../modules/VerifyToken")


const user ={
    id:42,
    login:"aaponaa",
    email:"connard@gmail.com"
};

router.get("/login",VerifyToken, (req,res) => {
    console.log('Hello')
    res.json(req.user);
})

// Looks for ath and give the token
router.post("/login", (req, res) => {
    // Authenticate User
    console.log(req.body);
    if (req.body.login !== user.login){
        res.status(401).send('invalid credentials');
        return;
    }
    if (req.body.password !== '1234'){
        res.status(401).send('invalid credentials');
        return;
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user)

    res.cookie('token',accessToken)
    res.end()
})

router.post('/refreshToken', (req,res) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //

    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401);
        }
        // TODO : Check BDD if user have the rights and exist
        delete user.iat;
        delete user.iat;
        const refreshedToken = generateAccessToken(user);
        res.send({
            accessToken: refreshedToken,
        });
    });
});

router.post("/register", (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    user.push({
        id : Date.now().toString(),
        login : req.body.login,
        password : hashedPassword
    }),
        function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")
            // create a token
            let token = generateAccessToken(user)
            res.status(200).send({ auth: true, token: token });
        }
});

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCES_TOKEN_SECRET, {expiresIn: '4000s'})
}

function generateRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'})
}


module.exports = router;
