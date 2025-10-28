const prisma = require("../prisma/client.js");

const getFunctionality = async (req, res) => {
	const { job, unit } = req.params;
	
	res.json(results);
  }


module.exports = { getFunctionality };