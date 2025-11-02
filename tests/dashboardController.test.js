const { getDashboard, getMetrics } = require('../controllers/dashboardController.js');

jest.mock('../prisma/client.js', () => ({
    unitTest: {
        findMany: jest.fn(),
        count: jest.fn()
    },
    unit: {
        findMany: jest.fn()
    },
    testResult: {
        findMany: jest.fn()
    }
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
        // inProgress
        prisma.unitTest.findMany
            .mockResolvedValueOnce([
                { id: 1, unit: { unit_number: '1234-50L' }, job: { job_number: 'JOB-1' }, started_at: new Date() }
            ])
            // recentSignOffs (second call)
            .mockResolvedValueOnce([
                { id: 2, unit: { unit_number: '1234-48L' }, job: { job_number: 'JOB-2' }, completed_at: new Date() }
            ]);

        prisma.unit.findMany.mockResolvedValue([
            { unit_number: 1 },
            { unit_number: 5 }
        ]);

        prisma.testResult.findMany.mockResolvedValue([
            { testPoint: { name: 'Incorrect Termination' } }
        ]);

        await getDashboard(req, res);

        expect(res.json).toHaveBeenCalled();
        const payload = res.json.mock.calls[0][0];
        expect(payload).toHaveProperty('inProgress');
        expect(Array.isArray(payload.inProgress)).toBe(true);
        expect(payload).toHaveProperty('recentSignOffs');
        expect(payload).toHaveProperty('nextFullWater');
        expect(payload.nextFullWater).toEqual([1, 5]);
        expect(payload).toHaveProperty('topDeficiencies');
    });

    test('getMetrics returns counts', async () => {
        // three sequential counts: todayTests, pendingSignoffs, activeTests
        prisma.unitTest.count
            .mockResolvedValueOnce(3)
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2);

        await getMetrics(req, res);

        expect(res.json).toHaveBeenCalledWith({
            todayTests: 3,
            pendingSignoffs: 1,
            activeTests: 2
        });
    });
});