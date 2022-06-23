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
    res.send("Sheet List")
})

router.get("/new", (req, res) => {
    res.render("users/new")
})

router
    .route("/:id")
    .get((req, res) => {
        let sheet = require('../sheets/char_'+req.params.id+'.json');
        res.status(200).json(sheet);
    })
    .post((req, res) => {
        const sheet= require("../sheets/char_"+req.params.id+".json");
        const it = sheet.items;
        const data = req.body;
        const dataKeys = Object.keys(data);

        for (let a = 0; a < it.length; a++){
            let item = it[a];

            if (item.attributes !== undefined) {
                let attri = Object.keys(item.attributes);
                if (attri[0] == dataKeys[0]) {

                    sheet.items[a].attributes = data;
                    console.log(sheet.items[a].attributes)
                }
            }
        }

// write JSON string to a file
        const dataString = JSON.stringify(sheet);
        console.log(dataString)
        fs.writeFile('./sheets/char_'+req.params.id+'.json', dataString, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });

    })

    .delete((req, res) => {
        res.send(`Delete User With ID ${req.params.id}`)
    })

module.exports = router