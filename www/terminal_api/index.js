const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(cors());

const sheetRouter = require("./routes/sheet")
const userRouter = require("./routes/users")

app.use("/sheet", sheetRouter)
app.use("/users", userRouter)

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});




