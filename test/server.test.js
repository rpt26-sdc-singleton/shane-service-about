/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/index');
const { db } = require('../database/db');

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
    test('Should respond with a 404 when the ID passed is not a number', (done) => {
      server
        .get('/api/about/not-a-number')
        .expect(404, done);
    });
    test('Should respond appropriately when a non-existent record is requested', (done) => {
      server
        .get('/api/about/330')
        .expect(404, done);
    });
    test('Should respond with a 201 status code when a POST request is made', (done) => {
      const courseID = 225;

      const body = {
        course_id: 12983901,
        recent_views: 6676565,
        description: 'Machine learning is the science of getting computers to act without being explicitly programmed. In the past decade, machine learning has given us self-driving cars, practical speech recognition, effective web search, and a vastly improved understanding of the human genome.',
        learner_career_outcomes: [
          {
            icon: 'fa-money',
            pct: 0.12,
            outcome: 'got a pay increase or promotion',
          },
        ],
        metadata: [
          {
            icon: 'speechbubble',
            title: 'English',
            subtitle: 'Subtitles: Arabic, French, Portuguese (European), Chinese (Simplified), Italian, Vietnamese, German, Russian, English, Hebrew, Spanish, Hindi, Japanese',
          },
        ],
        what_you_will_learn: [
          'Manipulate strings, dates, & numeric data using functions to integrate data from different sources into fields with the correct format for analysis.',
        ],
        skills_you_will_gain: [
          'Machine Learning',
        ],
      };

      server
        .post(`/api/about/${courseID}`)
        .send(body)
        .expect(201, done);
    });

    test('Should respond with a 204 status code when a PUT request is made', (done) => {
      const courseID = 225;

      const body = {
        description: 'abc123',
      };

      server
        .put(`/api/about/${courseID}`)
        .set('Content-Type', 'application/json')
        .send(body)
        .expect(200)
        .then(() => server.get(`/api/about/${courseID}`))
        .expect(200, {
          description: body.description,
        }, done);
    // test('Should respond with a 200 status code when a DELETE request is made', (done) => {
    //   server
    //     .delete('/api/about/1')
    //     .expect(200, done);
    });
    test('Should fail gracefully by serving index.html when an invalid route is requested', (done) => {
      server
        .get('/this/route/does/not/exist')
        .expect(200, done);
    });
    test('Should respond with 200 when requesting route /', (done) => {
      server
        .get('/')
        .expect(200)
        .end(done);
    });
  });

  afterAll(async () => {
    await db.close();
  });
});
