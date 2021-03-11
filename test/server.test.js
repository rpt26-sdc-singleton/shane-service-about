/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/index');

describe('Server Configuration', () => {
  let server;
  beforeAll(async () => {
    server = await request(app);
  });

  describe('/api/about/:id route', () => {
    test('Should respond with a record from the database', (done) => {
      server
        .get('/api/about/12')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.what_you_will_learn).toBeTruthy();
        })
        .expect(200, done);
    });
    test('Should respond appropriately when a non-existent record is requested', (done) => {
      server
        .get('/api/about/330')
        .expect(404, done);
    });
    test('Should respond with an 405 Method Not Allowed when a POST request is made', (done) => {
      server
        .post('/api/about/1')
        .expect(405, done);
    });
    test.todo('Should fail gracefully when an invalid route is requested');
  });
});
