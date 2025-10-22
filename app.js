require("dotenv").config();
const port = process.env.PORT || 8000;

const express = require("express");

const app = express();

//functionality acceptance testing
const fatRouter = require("./routes/fatRouter")
app.use("/api/forms", fatRouter);


const dashboardRouter = require("./routes/dashboardRouter")
app.use("/api/home", dashboardRouter)


app.listen(port, () => {
    console.log(`app listening on port: ${port}`)
})
