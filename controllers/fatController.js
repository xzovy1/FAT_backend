const prisma = require("../prisma/client.js");
const fatController = {};

fatController.getFunctionality = (req, res) => {
    res.json({ name: "test" });
}


module.exports = fatController;