const express = require('express')
const fatRouter = require("../routes/fatRouter")

const request = require("supertest")


const app = express();
app.use("/", fatRouter);

test("get functionality route works", done => {
    request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect({ name: "test" })
        .expect(200, done);
})