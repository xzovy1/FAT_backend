require("dotenv").config();
const port = process.env.PORT || 8000;

const express = require("express");

const app = express();

const authRouter = require('./routers/authRouter');
app.use('/api/auth', authRouter);

//factory acceptance testing
const functionalityRouter = require("./routers/functionalityRouter")
app.use("/api/forms", functionalityRouter);

const dashboardRouter = require("./routers/dashboardRouter")
app.use("/api/home", dashboardRouter)


app.listen(port, () => {
    console.log(`app listening on port: ${port}`)
})
