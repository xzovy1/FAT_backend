const { Router } = require("express");
const fatController = require("../controllers/fatController.js");
const fatRouter = Router();

fatRouter.get("/", fatController.getFunctionality)

module.exports = fatRouter;