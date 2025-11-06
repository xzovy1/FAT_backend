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
        req = { params: {}, body: {}, user: {} };
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        jest.clearAllMocks();
    });

    test('getFunctionality returns structured sections + existing results', async () => {
        req.params = { job_id: '1', unit_id: '2' };

        prisma.unitTest.findFirst.mockResolvedValue({
            id: 10,
            unit: { unit_number: 2, unit_hand: 'LEFT', model: 'M-100' },
            job: { job_number: 1234, plc_mfg: 'Siemens' },
            technician: { id: 5, firstname: 'Sam', lastname: 'Tech', shift: 'A' },
            form: {
                id: 3,
                name: 'Water Test v1',
                sections: [
                    {
                        id: 1,
                        name: 'Section A',
                        sequence: 1,
                        points: [
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
                { test_point_id: 100, actual_value: '5', actual_number: 5, result: 'PASS', comments: 'ok' }
            ]
        });

        await getFunctionality(req, res);

        expect(res.json).toHaveBeenCalled();
        const payload = res.json.mock.calls[0][0];
        expect(payload.testId).toBe(10);
        expect(payload.unitInfo).toMatchObject({ number: 2, hand: 'LEFT', model: 'M-100' });
        expect(payload.jobInfo).toMatchObject({ number: 1234, plcMfg: 'Siemens' });
        expect(Array.isArray(payload.sections)).toBe(true);
        expect(payload.sections[0].testPoints[0].result).toEqual({
            test_point_id: 100,
            actual_value: '5',
            actual_number: 5,
            result: 'PASS',
            comments: 'ok'
        });
    });

    test('saveTestResult upserts and returns created/updated result', async () => {
        req.params = { unitTestId: '10', testPointId: '100' };
        req.body = { value: 7, result: 'PASS', comments: 'measured 7' };
        req.user = { technicianId: 42 };

        prisma.testResult.upsert.mockResolvedValue({
            id: 1,
            unit_test_id: 10,
            test_point_id: 100,
            actual_value: '7',
            actual_number: 7,
            result: 'Fail',
            comments: 'Wires swapped at TB52',
            deficiency_category: "INCORRECT_TERMINATION",
            created_by: 42
        });

        await saveTestResult(req, res);

        expect(prisma.testResult.upsert).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: 1,
            unit_test_id: 10,
            test_point_id: 100,
            actual_value: '7',
            actual_number: 7,
            result: 'Fail',
            comments: 'Wires swapped at TB52',
            deficiency_category: "INCORRECT_TERMINATION",
            created_by: 42
        }));
    });

    test('completeTest updates unitTest completed_at and returns it', async () => {
        req.params = { unitTestId: '10' };
        req.body = { conditionalSignOff: false, comments: 'All checks passed' };
        req.user = { technicianId: 42 };

        const returned = {
            id: 10,
            completed_at: new Date(),
            conditional_sign_off: false,
            completed_by: 42,
            comments: 'All checks passed'
        };
        prisma.unitTest.update.mockResolvedValue(returned);

        await completeTest(req, res);

        expect(prisma.unitTest.update).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                completed_at: expect.any(Date),
                conditional_sign_off: false,
                completed_by: 42,
                comments: 'All checks passed'
            })
        });

        expect(res.json).toHaveBeenCalledWith(returned);
    });
});