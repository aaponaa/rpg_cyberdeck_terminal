const express = require("express");
const router = express.Router();
const fs = require('fs');
const VerifyToken = require("../modules/VerifyToken")

const sheets =  [
    {
        id: "32",
        path: "char_32.json",
        user: "aaponaa"
    },
    {
        id: "34",
        path: "char_34.json",
        user: "tonton"
    },
];

router.get("/", VerifyToken,(req, res) => {
    res.send("Welcome User: "+ req.user.login)
    res.json(sheets.filter(sheets => sheets.user === req.user.login));
});

router.get("/get/:id",(req, res) => {
    /*let sheet = require('../sheets/char_'+req.params.id+'.json');
    */

    console.log("get sheet")
    import('../data/sheets/char_1.json').then(json => {
        res.status(200).json(json);
    });
    // file;
    // fs.readFile('./sheets/char_1.json', 'utf8', (err, data) => {
    //
    //     if (err) {
    //         console.log(`Error reading file from disk: ${err}`);
    //     } else {
    //
    //         parse JSON string to JSON object
            // const sheet = JSON.parse(data);
            //
            // res.status(200).json(sheet);
        // }

    // });

});

// HTML Table Data Formatting
router.post("/save/:id",(req, res) => {
    const dataString = JSON.stringify(req.body.getters.sheet);

    fs.writeFile('./sheets/char_1.json', dataString, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
});

router.delete((req, res) => {
    res.send(`Delete User With ID ${req.params.id}`)
    });

export default router;