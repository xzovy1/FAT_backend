const { Router } = require("express");
const functionalityController = require("../controllers/functionalityController.js");
const functionalityRouter = Router();


// GET /unit-tests/:job/:unit
functionalityRouter.get('/:job/:unit', functionalityController.getFunctionality);

// POST /unit-tests/:job/:id
functionalityRouter.post('/start', functionalityController.startFunctionality)

module.exports = functionalityRouter;