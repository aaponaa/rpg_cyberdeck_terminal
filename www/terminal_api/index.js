const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;
const bodyParser = require("body-parser")


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));

app.use(cors());

const sheetRouter = require("./routes/CharSheet")
const userRouter = require("./routes/AuthController")
const jwt = require("jsonwebtoken");

app.use("/sheet", sheetRouter)
app.use("/auth", userRouter)

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});




