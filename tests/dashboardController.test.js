const { getDashboard, getMetrics } = require('../controllers/dashboardController.js');

jest.mock('../prisma/client.js', () => ({
    unitTest: {
        findMany: jest.fn(),
        count: jest.fn()
    },
    testResult: {
        findMany: jest.fn(),
        count: jest.fn()
    },
    $queryRaw: jest.fn()
}));

const prisma = require('../prisma/client.js');

describe('dashboardController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {};
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        jest.clearAllMocks();
    });

    test('getDashboard returns aggregated dashboard payload', async () => {
        // inProgress (first findMany call)
        prisma.unitTest.findMany
            .mockResolvedValueOnce([
                {
                    id: 1,
                    unit: { unit_number: 50, unit_hand: 'LEFT', model: 'ModelX' },
                    job: { job_number: 1234 },
                    started_at: new Date('2025-11-05T08:00:00Z'),
                    technician: { firstname: 'John', lastname: 'Doe' },
                    form: { name: 'Water Test' },
                    test_type: 'FULLWATER'
                }
            ])
            // recentSignOffs (second findMany call)
            .mockResolvedValueOnce([
                {
                    id: 2,
                    unit: { unit_number: 48, unit_hand: 'RIGHT', model: 'ModelY' },
                    job: { job_number: 2345 },
                    completed_at: new Date('2025-11-04T12:00:00Z'),
                    technician: { firstname: 'Jane', lastname: 'Smith' },
                    test_type: 'BYPASS'
                }
            ]);

        // $queryRaw for nextFullWaterRows
        prisma.$queryRaw.mockResolvedValue([
            { id: 101, unit_number: 1, unit_hand: 'LEFT', model: 'M1' },
            { id: 102, unit_number: 5, unit_hand: 'RIGHT', model: 'M2' }
        ]);

        // topDeficiencies
        prisma.testResult.findMany.mockResolvedValue([
            {
                id: 201,
                testPoint: { name: 'Incorrect Termination', section: { name: 'Electrical' } },
                unitTest: { unit: { unit_number: 50 } }
            }
        ]);

        await getDashboard(req, res);

        expect(res.json).toHaveBeenCalled();
        const payload = res.json.mock.calls[0][0];

        // inProgress checks
        expect(payload).toHaveProperty('inProgress');
        expect(Array.isArray(payload.inProgress)).toBe(true);
        expect(payload.inProgress.length).toBe(1);
        expect(payload.inProgress[0]).toMatchObject({
            unit: 50,
            unitHand: 'LEFT',
            model: 'ModelX',
            job: 1234,
            formName: 'Water Test',
            testType: 'FULLWATER'
        });

        // recentSignOffs checks
        expect(payload).toHaveProperty('recentSignOffs');
        expect(Array.isArray(payload.recentSignOffs)).toBe(true);
        expect(payload.recentSignOffs[0]).toMatchObject({
            unit: 48,
            unitHand: 'RIGHT',
            model: 'ModelY',
            job: 2345,
            testType: 'BYPASS'
        });

        // nextFullWater checks
        expect(payload).toHaveProperty('nextFullWater');
        expect(payload.nextFullWater).toEqual([
            { unitNumber: 1, unitHand: 'LEFT', model: 'M1' },
            { unitNumber: 5, unitHand: 'RIGHT', model: 'M2' }
        ]);

        // topDeficiencies checks
        expect(payload).toHaveProperty('topDeficiencies');
        expect(payload.topDeficiencies[0]).toMatchObject({
            type: 'Incorrect Termination',
            section: 'Electrical',
            unit: 50,
            quantity: 1
        });
    });

    test('getMetrics returns counts including failedTests', async () => {
        // unitTest.count calls: todayTests, pendingSignoffs, activeTests
        prisma.unitTest.count
            .mockResolvedValueOnce(3) // todayTests
            .mockResolvedValueOnce(1) // pendingSignoffs
            .mockResolvedValueOnce(2); // activeTests

        // testResult.count for failedTests
        prisma.testResult.count.mockResolvedValueOnce(4);

        await getMetrics(req, res);

        expect(res.json).toHaveBeenCalledWith({
            todayTests: 3,
            pendingSignoffs: 1,
            activeTests: 2,
            failedTests: 4
        });
    });
});