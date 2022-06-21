const express = require('express');
const app = express();
const SHEET = require('./char2.json');
const cors = require('cors');

const PORT = 8080;

app.use(cors());

app.get('/sheet', (req,res) => {
    res.status(200).json(SHEET)
})

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});




