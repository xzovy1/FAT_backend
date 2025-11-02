const express = require('express');
const request = require('supertest');

jest.mock('../controllers/dashboardController', () => ({
    getDashboard: (req, res) => res.json({ dashboard: true }),
    getMetrics: (req, res) => res.json({ metrics: true })
}));

// bypass auth middleware for router tests
jest.mock('../middleware/auth', () => ({
    authenticateToken: (req, res, next) => next()
}));

const dashboardRouter = require('../routers/dashboardRouter');

describe('dashboardRouter (integration)', () => {
    let app;
    beforeAll(() => {
        app = express();
        app.use('/api/home', dashboardRouter);
    });

    test('GET /api/home -> getDashboard', async () => {
        const res = await request(app).get('/api/home').expect(200).expect('Content-Type', /json/);
        expect(res.body).toEqual({ dashboard: true });
    });

    test('GET /api/home/metrics -> getMetrics', async () => {
        const res = await request(app).get('/api/home/metrics').expect(200);
        expect(res.body).toEqual({ metrics: true });
    });
});