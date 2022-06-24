const express = require("express")
const bodyParser = require("body-parser")
const router = express.Router()
const fs = require('fs')

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

router.post("/test", (req, res) => {
    res.send("test")
})

module.exports = router