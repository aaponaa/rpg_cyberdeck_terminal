const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;
const bodyParser = require("body-parser")
const trustedHost = ["http://localhost:3001","http://localhost:3000"]

const corsOptions = {
    origin: trustedHost,
    credentials: true
};

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));


app.use(cors(corsOptions));

const sheetRouter = require("./routes/CharSheet")
const userRouter = require("./routes/AuthController")


app.use("/sheet", sheetRouter)
app.use("/auth", userRouter)

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});




