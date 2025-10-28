const { Router } = require("express");
const functionalityController = require("../controllers/functionalityController.js");
const functionalityRouter = Router();


// GET /unit-tests/:
functionalityRouter.get('/testing-forms/:job/:unit', functionalityController.getFunctionality);


module.exports = functionalityRouter;