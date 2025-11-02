const prisma = require("../prisma/client.js");

// Get test functionality for a specific job and unit
const getFunctionality = async (req, res) => {
	try {
		const { job_id, unit_id } = req.params;

		const unitTest = await prisma.unitTest.findFirst({
			where: {
				job_id: parseInt(job_id),
				unit_id: parseInt(unit_id),
				completed_at: null
			},
			include: {
				form: {
					include: {
						TestSection: {
							include: {
								testPoints: true
							},
							orderBy: {
								sequence: 'asc'
							}
						}
					}
				},
				results: true
			}
		});

		if (!unitTest) {
			return res.status(404).json({ error: 'Active test not found' });
		}

		// Transform data for frontend
		const sections = unitTest.form.TestSection.map(section => ({
			id: section.id,
			name: section.name,
			sequence: section.sequence,
			testPoints: section.testPoints.map(point => ({
				id: point.id,
				name: point.name,
				description: point.description,
				dataType: point.data_type,
				expectedValue: point.expected_value,
				expectedValues: point.expected_values,
				result: unitTest.results.find(r => r.test_point_id === point.id)
			}))
		}));

		res.json({
			testId: unitTest.id,
			sections: sections
		});

	} catch (error) {
		console.error('Functionality error:', error);
		res.status(500).json({ error: 'Failed to fetch test functionality' });
	}
};

// Save test result for a specific test point
const saveTestResult = async (req, res) => {
	try {
		const { unitTestId, testPointId } = req.params;
		const { value, result } = req.body;

		const testResult = await prisma.testResult.upsert({
			where: {
				unit_test_id_test_point_id: {
					unit_test_id: parseInt(unitTestId),
					test_point_id: parseInt(testPointId)
				}
			},
			update: {
				actual_value: value?.toString(),
				actual_number: typeof value === 'number' ? value : null,
				result: result
			},
			create: {
				unit_test_id: parseInt(unitTestId),
				test_point_id: parseInt(testPointId),
				actual_value: value?.toString(),
				actual_number: typeof value === 'number' ? value : null,
				result: result
			}
		});

		res.json(testResult);

	} catch (error) {
		console.error('Save result error:', error);
		res.status(500).json({ error: 'Failed to save test result' });
	}
};

// Complete a unit test
const completeTest = async (req, res) => {
	try {
		const { unitTestId } = req.params;
		const { conditionalSignOff } = req.body;

		const updatedTest = await prisma.unitTest.update({
			where: {
				id: parseInt(unitTestId)
			},
			data: {
				completed_at: new Date(),
				conditional_sign_off: conditionalSignOff
			}
		});

		res.json(updatedTest);

	} catch (error) {
		console.error('Complete test error:', error);
		res.status(500).json({ error: 'Failed to complete test' });
	}
};

module.exports = {
	getFunctionality,
	saveTestResult,
	completeTest
};