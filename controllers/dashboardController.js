const prisma = require("../prisma/client.js");

const getDashboard = (req, res) => {
    res.json({ nextFW: "1234-56L" })
}

module.exports = { getDashboard }