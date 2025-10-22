const { Router } = require("express");
const dashboardController = require("../controllers/dashboardController.js");
const dashboardRouter = Router();

dashboardRouter.get("/home", dashboardController.getDashboard)

module.exports = dashboardRouter;