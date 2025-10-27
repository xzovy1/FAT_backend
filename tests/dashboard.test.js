const express = require('express')

const request = require("supertest")

const app = express();

const dashboardRouter = require("../routes/dashboardRouter")

app.use('/', dashboardRouter);

test("get functionality route works", done => {
    request(app)
        .get("/home")
        .expect("Content-Type", /json/)
        .expect({
            nextFullWater: ["1234-56L", "1234-57R"],
            inProgress: ["1234-50L", "1234-51R"],
            recentSignOffs: ["1234-48L", "1234-49R"],
            topDeficiencies: [{ type: "Incorrect Termination", quantity: 20 }, { type: "Poor Workmanship", quantity: 52 }],
        })
        .expect(200, done);
})