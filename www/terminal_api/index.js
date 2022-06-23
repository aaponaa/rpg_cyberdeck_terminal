const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(cors());

const userRouter = require("./routes/sheet")
app.use("/sheet", userRouter)

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});




