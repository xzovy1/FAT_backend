const express = require('express')

const request = require("supertest")

const app = express();

const dashboardRouter = require("../routes/dashboardRouter")

app.use('/', dashboardRouter);

test("get functionality route works", done => {
    request(app)
        .get("/home")
        .expect("Content-Type", /json/)
        .expect({ nextFW: "1234-56L" })
        .expect(200, done);
})