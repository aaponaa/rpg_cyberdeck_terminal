const express = require("express")

const router = express.Router()
const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const user ={
    id:42,
    login:"aaponaa",
    email:"connard@gmail.com"
}


const sheets =  [
    {
        id: "32",
        path: "char_32.json",
        user: "aaponaa"
    },
    {
        id: "1",
        path: "char_1.json",
        user: "aaponaa"
    },
    {
        id: "2",
        path: "char_2.json",
        user: "aaponaa"
    },
    {
        id: "34",
        path: "char_34.json",
        user: "tonton"
    },
]

router.get("/", (req, res) => {
    console.log(req.query.name)
    res.send("Users List")
})

router.get("/new", (req, res) => {
    res.render("users/new")
})

router.get("/auth", authenticateToken, (req,res) => {
    res.json(sheets.filter(sheets => sheets.user === req.user.login));
})

// Looks for ath and give the token
router.post("/login", (req, res) => {
    // Authenticate User
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
    res.send({
        accessToken,
        refreshToken
    });
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

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //

    if(!token){
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCES_TOKEN_SECRET, {expiresIn: '4000s'})
}

function generateRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'})
}

module.exports = router;
