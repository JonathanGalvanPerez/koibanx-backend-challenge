const { app, server } = require('../app');
const connection = require('mongoose').connection;
const supertest = require('supertest');

const request = supertest(app);

describe('Testing autheticate middleware', function () {
  it('response with Bad request if basic auth is missing', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, '{"error":"Auth Basic expected"}', done);
  });

  it('response with Unathorize if username is wrong', (done) => {
    request
      .post('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic YXNkOmFzZA==')
      .expect('Content-Type', /json/)
      .expect(401, '{"error":"Username does not exists"}', done);
  });

  it('response with Unathorize if password is wrong', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphc2Q=')
      .expect('Content-Type', /json/)
      .expect(401, '{"error":"Incorrect Password"}', done);
  });
});

afterAll(async () => {
  connection.close();
  server.close();
});