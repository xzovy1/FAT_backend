const prisma = require("../prisma/client.js");

exports.createJobNumber = async (req, res) => {
    const { job_id, plc_mfg, unit_model } = req.body.formdata
    try {
        const job = await prisma.job.create({
            data: {
                id: parseInt(job_id),
                plc_mfg,
                model: unit_model,
            }
        })

    } catch (error) {
        console.error('Job number creation error:', error);
        res.status(500).json({ error: error });
    }
}

exports.getDashboard = async (req, res) => {
    try {
        // Get units in progress (have active tests)
        const inProgress = await prisma.unitTest.findMany({
            where: {
                completed_at: null
            },
            include: {
                unit: true,
                job: true,
                form: true        // Include test form details
            }
        });

        // Get recently completed tests (last 2 days)
        const recentSignOffs = await prisma.unitTest.findMany({
            where: {
                completed_at: {
                    gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            },
            include: {
                unit: true,
                job: true,
                signoff_by: true,
                form: true
            },
            orderBy: {
                completed_at: 'desc'
            },
            take: 10
        });

        // Get units waiting for water test
        const nextFullWaterRows = await prisma.$queryRaw`
          SELECT u.id, u.unit_number, u.unit_hand
          FROM "Unit" u
          WHERE (u.unit_number % 8) IN (1, 2)
            AND NOT EXISTS (
              SELECT 1 FROM "UnitTest" ut WHERE ut.unit_id = u.id
            )
          ORDER BY u.unit_number ASC
          LIMIT 5
        `;

        // Get top deficiencies with more context
        const topDeficiencies = await prisma.testResult.findMany({
            where: {
                result: 'FAIL'
            },
            include: {
                testPoint: {
                    include: {
                        section: true  // Include section info
                    }
                },
                unitTest: {
                    include: {
                        unit: true
                    }
                }
            },
            take: 5
        });

        res.json({
            inProgress: inProgress.map(test => ({
                unit: test.unit.unit_number,
                unitHand: test.unit.unit_hand,
                model: test.unit.model,
                job: test.job.job_number,
                startedAt: test.started_at,
                technician: test.technician ? `${test.technician.firstname} ${test.technician.lastname}` : null,
                formName: test.form.name,
                testType: test.test_type
            })),
            recentSignOffs: recentSignOffs.map(test => ({
                unit: test.unit.unit_number,
                unitHand: test.unit.unit_hand,
                model: test.unit.model,                // <--- ensure model is included
                job: test.job.job_number,
                completedAt: test.completed_at,
                technician: test.technician ? `${test.technician.firstname} ${test.technician.lastname}` : null,
                testType: test.test_type
            })),
            nextFullWater: nextFullWaterRows.map(unit => ({
                unitNumber: unit.unit_number,
                unitHand: unit.unit_hand,
                model: unit.model
            })),
            topDeficiencies: topDeficiencies.map(result => ({
                type: result.testPoint.name,
                section: result.testPoint.section.name,
                unit: result.unitTest.unit.unit_number,
                quantity: 1
            }))
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

exports.getMetrics = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));

        const metrics = {
            todayTests: await prisma.unitTest.count({
                where: {
                    started_at: {
                        gte: startOfDay
                    }
                }
            }),
            pendingSignoffs: await prisma.unitTest.count({
                where: {
                    completed_at: { not: null },
                    signoff_id: null
                }
            }),
            activeTests: await prisma.unitTest.count({
                where: {
                    completed_at: null
                }
            }),
            failedTests: await prisma.testResult.count({
                where: {
                    result: 'FAIL',
                    unitTest: {
                        started_at: {
                            gte: startOfDay
                        }
                    }
                }
            })
        };

        res.json(metrics);
    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};

