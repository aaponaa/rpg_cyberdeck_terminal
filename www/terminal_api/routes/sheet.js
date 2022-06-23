const express = require("express")
const bodyParser = require("body-parser")
const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

router.get("/", (req, res) => {
    console.log(req.query.name)
    res.send("Sheet List")
})

router.get("/new", (req, res) => {
    res.render("users/new")
})

router
    .route("/:id")
    .get((req, res) => {
        console.log('../sheets/char_'+req.params.id+'.json')
        let sheet = require('../sheets/char_'+req.params.id+'.json');
        res.status(200).json(sheet)
    })
    .post((req, res) => {
        console.log(req.body)
        res.send('POST the JSON saved !'+req.params.id);
    })

    .delete((req, res) => {
        res.send(`Delete User With ID ${req.params.id}`)
    })

module.exports = router