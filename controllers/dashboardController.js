const prisma = require("../prisma/client.js");

const getDashboard = (req, res) => {
    res.json({
        nextFullWater: ["1234-56L", "1234-57R"],
        inProgress: ["1234-50L", "1234-51R"],
        recentSignOffs: ["1234-48L", "1234-49R"],
        topDeficiencies: [
            { type: "Incorrect Termination", quantity: 20 },
            { type: "Poor Workmanship", quantity: 52 }
        ],
    })
}

module.exports = { getDashboard }