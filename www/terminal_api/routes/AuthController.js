const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const VerifyToken = require("./VerifyToken")


const user ={
    id:42,
    login:"aaponaa",
    email:"connard@gmail.com"
};

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
];

router.get("/", (req, res) => {
    res.send("Users List")
});

router.get("/sheets", VerifyToken, (req,res) => {
    res.json(sheets.filter(sheets => sheets.user === req.user.login));
});

router.post("/register", (req, res) => {
   const hashedPassword = bcrypt.hashSync(req.body.password, 8);

       user.push({
                id : Date.now().toString(),
                login : req.body.login,
               email : req.body.email,
               password : hashedPassword
           }),
           function (err, user) {
               if (err) return res.status(500).send("There was a problem registering the user.")
               // create a token
               let token = generateAccessToken(user)
               res.status(200).send({ auth: true, token: token });
           }
});


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
