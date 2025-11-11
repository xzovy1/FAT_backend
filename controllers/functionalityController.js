const prisma = require("../prisma/client.js");

exports.startFunctionality = async (req, res) => {
	try {
		const { job_id, unit_id, orientation, test_type } = req.body;
		const job = await prisma.job.findUnique({
			where: {
				id: job_id
			}
		})
		if (!job) return res.status(404).json({ error: 'Job number not found' });


		console.log(req.body)
	} catch (error) {
		console.error(error)
	}
}

exports.getFunctionality = async (req, res) => {
	try {
		const { job_id, unit_id } = req.params;

		const unitTest = await prisma.unitTest.findFirst({
			where: {
				job_id: parseInt(job_id),
				unit_id: parseInt(unit_id),
				completed_at: null
			},
			include: {
				unit: true,
				job: true,
				technician: true,
				form: {
					include: {
						sections: {  // Updated from TestSection to match schema
							include: {
								points: true  // Updated from testPoints to match schema
							},
							orderBy: {
								sequence: 'asc'
							}
						}
					}
				},
				results: {
					include: {
						created_by: true  // Include technician who created result
					}
				}
			}
		});

		if (!unitTest) {
			return res.status(404).json({ error: 'Active test not found' });
		}

		// Transform data for frontend
		const sections = unitTest.form.sections.map(section => ({
			id: section.id,
			name: section.name,
			sequence: section.sequence,
			testPoints: section.points.map(point => ({
				id: point.id,
				name: point.name,
				description: point.description,
				dataType: point.data_type,
				expectedValue: point.expected_value,
				expectedValues: point.expected_values,
				result: unitTest.results.find(r => r.test_point_id === point.id),
				comments: unitTest.results.find(r => r.test_point_id === point.id)?.comments || null
			}))
		}));

		res.json({
			testId: unitTest.id,
			unitInfo: {
				number: unitTest.unit.unit_number,
				hand: unitTest.unit.unit_hand,
				model: unitTest.unit.model
			},
			jobInfo: {
				number: unitTest.job.job_number,
				plcMfg: unitTest.job.plc_mfg
			},
			technician: unitTest.technician ? {
				id: unitTest.technician.id,
				name: `${unitTest.technician.firstname} ${unitTest.technician.lastname}`,
				shift: unitTest.technician.shift
			} : null,
			sections: sections
		});

	} catch (error) {
		console.error('Functionality error:', error);
		res.status(500).json({ error: 'Failed to fetch test functionality' });
	}
};

exports.saveTestResult = async (req, res) => {
	try {
		const { unitTestId, testPointId } = req.params;
		const { value, result, comments } = req.body;
		const technician_id = req.user.technicianId; // From auth middleware

		if (!technician_id) {
			return res.status(403).json({ error: 'Must be a technician to save results' });
		}

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
				result: result,
				comments: comments,
				updated_at: new Date()
			},
			create: {
				unit_test_id: parseInt(unitTestId),
				test_point_id: parseInt(testPointId),
				actual_value: value?.toString(),
				actual_number: typeof value === 'number' ? value : null,
				result: result,
				comments: comments,
				created_by: technician_id
			}
		});

		res.json(testResult);

	} catch (error) {
		console.error('Save result error:', error);
		res.status(500).json({ error: 'Failed to save test result' });
	}
};

exports.completeTest = async (req, res) => {
	try {
		const { unitTestId } = req.params;
		const { conditionalSignOff, comments } = req.body;
		const technician_id = req.user.technicianId;

		if (!technician_id) {
			return res.status(403).json({ error: 'Must be a technician to complete tests' });
		}

		const updatedTest = await prisma.unitTest.update({
			where: {
				id: parseInt(unitTestId)
			},
			data: {
				completed_at: new Date(),
				conditional_sign_off: conditionalSignOff,
				completed_by: technician_id,
				comments: comments
			}
		});

		res.json(updatedTest);

	} catch (error) {
		console.error('Complete test error:', error);
		res.status(500).json({ error: 'Failed to complete test' });
	}
};