const prisma = require("../prisma/client.js");

const getDashboard = async (req, res) => {
    try {
        // Get units in progress (have active tests)
        const inProgress = await prisma.unitTest.findMany({
            where: {
                completed_at: null
            },
            include: {
                unit: true,
                job: true
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
                job: true
            },
            orderBy: {
                completed_at: 'desc'
            },
            take: 10
        });

        // Get units waiting for test
        // 
        // for even units (except unit # 2): unitNumber % 8 == 2
        // for odd (except unit # 1):        unitNumber % 8 == 1
        const nextFullWater = await prisma.unit.findMany({
            where: {
                AND: [
                    {
                        unit_number: {
                            OR: [
                                {
                                    AND: [
                                        { mod: [2, 1] }, //odd
                                        { mod: [8, 1] }
                                    ]

                                },
                                {
                                    AND: [
                                        { mod: [2, 0] }, //even
                                        { mod: [8, 2] }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        unitTests: {
                            none: {} // No tests yet
                        }
                    }
                ]
            },
            orderBy: {
                unit_number: 'asc'
            },
            take: 5,
            select: {
                unit_number: true
            }
        });

        // Get top deficiencies (FAIL results)
        const topDeficiencies = await prisma.testResult.findMany({
            where: {
                result: 'FAIL'
            },
            include: {
                testPoint: true
            },
            take: 5
        });

        res.json({
            inProgress: inProgress.map(test => ({
                unit: test.unit.unit_number,
                job: test.job.job_number,
                startedAt: test.started_at
            })),
            recentSignOffs: recentSignOffs.map(test => ({
                unit: test.unit.unit_number,
                job: test.job.job_number,
                completedAt: test.completed_at
            })),
            nextFullWater: nextFullWater.map(unit => unit.unit_number),
            topDeficiencies: topDeficiencies.map(result => ({
                type: result.testPoint.name,
                quantity: 1
            }))
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

const getMetrics = async (req, res) => {
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
            })
        };

        res.json(metrics);
    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
};

module.exports = { getDashboard, getMetrics };
