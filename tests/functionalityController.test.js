const {
    getFunctionality,
    saveTestResult,
    completeTest
} = require('../controllers/functionalityController');

jest.mock('../prisma/client.js', () => ({
    unitTest: {
        findFirst: jest.fn(),
        update: jest.fn()
    },
    testResult: {
        upsert: jest.fn()
    }
}));

const prisma = require('../prisma/client.js');

describe('functionalityController', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        jest.clearAllMocks();
    });

    test('getFunctionality returns structured sections + existing results', async () => {
        req.params = { job_id: '1', unit_id: '2' };

        prisma.unitTest.findFirst.mockResolvedValue({
            id: 10,
            form: {
                TestSection: [
                    {
                        id: 1,
                        name: 'Section A',
                        sequence: 1,
                        testPoints: [
                            {
                                id: 100,
                                name: 'TP1',
                                description: 'desc',
                                data_type: 'NUMBER',
                                expected_value: '5',
                                expected_values: null
                            }
                        ]
                    }
                ]
            },
            results: [
                { test_point_id: 100, actual_value: '5', result: 'PASS' }
            ]
        });

        await getFunctionality(req, res);

        expect(res.json).toHaveBeenCalled();
        const payload = res.json.mock.calls[0][0];
        expect(payload.testId).toBe(10);
        expect(payload.sections[0].testPoints[0].result).toEqual({ test_point_id: 100, actual_value: '5', result: 'PASS' });
    });

    test('saveTestResult upserts and returns created/updated result', async () => {
        req.params = { unitTestId: '10', testPointId: '100' };
        req.body = { value: 7, result: 'PASS' };

        prisma.testResult.upsert.mockResolvedValue({ id: 1, actual_value: '7', actual_number: 7, result: 'PASS' });

        await saveTestResult(req, res);

        expect(prisma.testResult.upsert).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ id: 1, actual_value: '7', actual_number: 7, result: 'PASS' });
    });

    test('completeTest updates unitTest completed_at and returns it', async () => {
        req.params = { unitTestId: '10' };
        req.body = { conditionalSignOff: true };

        prisma.unitTest.update.mockResolvedValue({ id: 10, completed_at: new Date(), conditional_sign_off: true });

        await completeTest(req, res);

        expect(prisma.unitTest.update).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });
});