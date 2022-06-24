const express = require("express")
const bodyParser = require("body-parser")
const router = express.Router()
const fs = require('fs')

const jwt = require('express-jwt')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));

router.get("/", (req, res) => {
    console.log(req.query.name)
    res.send("Users List")
})

router.get("/new", (req, res) => {
    res.render("users/new")
})

router.post("/login", (req, res) => {
    // Authenticate User

    const username= req.body.username

    jwt.()
})

module.exports = router