const express = require("express");
const router = express.Router();
const fs = require('fs');
const VerifyToken = require("../modules/VerifyToken")

function saveSheet(sheet){
    // write JSON string to a file
    const dataString = JSON.stringify(sheet);
    fs.writeFile('./sheets/char_1.json', dataString, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
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
];

router.get("/", VerifyToken,(req, res) => {
    res.send("Welcome User: "+ req.user.login)
    res.json(sheets.filter(sheets => sheets.user === req.user.login));
});


router.get("/get/:id",(req, res) => {
    let sheet = require('../sheets/char_'+req.params.id+'.json');
    res.status(200).json(sheet);
});!

// HTML Table Data Formatting
router.post("/tab/:id",(req, res) => {

    const data = req.body;
    const valueKeys = Object.keys(data)
    const len = Object.values(data)[0].length
    let sheet = require("../sheets/char_1.json");
    let object = [];
    let tabObj = {};

    for(let a=0; a < len; a++){
        let count = 0;
        for (let k=0; k < valueKeys.length; k++){
            if (count < 4) {
                tabObj[valueKeys[count]] = Object.values(data)[k][a];
                count += 1;
            }if (count === 4){
                object.push(tabObj);
                count=0;
                tabObj = {};
            }
        }
    }
    for (let a = 0; a < sheet.items.length; a++) {
        let item = sheet.items[a];
        if (item.row !== undefined) {
            let rowsKey = Object.keys(item.row[0]);
            if (rowsKey.toString() === valueKeys.toString()) {
                sheet.items[a].row = object;
            }
        }
    }
    saveSheet(sheet)
})
router.post("/txt/:id",(req, res) => {
    const data = req.body;
    let sheet = require("../sheets/char_1.json");

    for (let a = 0; a < sheet.items.length; a++) {
        let item = sheet.items[a];
        console.log(data)
        if (item.table !== undefined && item.table === data.key){
            console.log(item.Notes)
        }
        /*if (item.row !== undefined) {
            let rowsKey = Object.keys(item.row[0]);
            if (rowsKey.toString() === valueKeys.toString()) {
                console.log(rowsKey + ' : ' + valueKeys)
                sheet.items[a].row = object;
            }
        }*/
    }// TODO : Make the algo that store the data in sheet
    //saveSheet(sheet)
})

// HTML Attributs Data Formating
router.post("/attr/:id",(req, res) => {
    const sheet = require("../sheets/char_1.json");
    const data = req.body;

    const dataKeys = Object.keys(data);
    for (let a = 0; a < sheet.items.length; a++) {
        let item = sheet.items[a];
        if (item.attributes !== undefined) {
            let attri = Object.keys(item.attributes);
            if (attri[0] == dataKeys[0]) {
                sheet.items[a].attributes = data;
            }
        }
    }
    saveSheet(sheet)
})


router.delete((req, res) => {
    res.send(`Delete User With ID ${req.params.id}`)
    })

module.exports = router;