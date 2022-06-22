const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 8080;

app.use(cors());

app.get('/sheet/:id', (req,res) => {
    let SHEET = require('../sheets/char_'+req.params.id+'.json');
    res.status(200).json(SHEET)
})

// POST method route
app.post('/post-sheet:value', function (req, res) {

    res.send('POST the JSON saved !'+req.params.value);
});

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});




