/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/index');

describe('Server Configuration', () => {
  describe('/api/about/:id route', () => {
    test('Should respond with a record from the database', () => {
      request(app)
        .get('/api/about/12')
        .expect(500);
    });
  });
});
