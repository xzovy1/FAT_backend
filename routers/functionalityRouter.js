const { Router } = require("express");
const functionalityController = require("../controllers/functionalityController.js");
const functionalityRouter = Router();


// GET /unit-tests/:job/:unit
functionalityRouter.get('/testing-forms/:job/:unit', functionalityController.getFunctionality);

// POST /unit-tests/:job/:id
functionalityRouter.post('/testing-forms/begin', functionalityController.startFunctionality)

module.exports = functionalityRouter;