const { app, server } = require('../app');
const connection = require('mongoose').connection;
const supertest = require('supertest');

const request = supertest(app);

describe('Testing validations', function () {
  it('response with Bad request if query params are missing', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body.errors).toHaveLength(5);
        return done();
      });
  });

  it('response with Bad request if query params if limit param is missing', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id' })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body.errors).toHaveLength(2);
        expect(res.body.errors[0]).toEqual({
          msg: 'Parámetro limit es requerido',
          param: 'limit',
          location: 'query',
        });
        expect(res.body.errors[1]).toEqual({
          msg: 'Parámetro limit debe ser un numero',
          param: 'limit',
          location: 'query',
        });
        return done();
      });
  });

  it('response with Bad request if query params if sort param is wrong', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'hello', limit: 10 })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0]).toEqual({
          msg: 'Parámetro sort debe tener valor cuit o id',
          param: 'sort',
          location: 'query',
          value: 'hello',
        });
        return done();
      });
  });
  
  it('response with Bad request if q param is not a valid JSON', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit: 10, q: true })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0]).toEqual({
          msg: 'Parámetro q debe ser un JSON valido',
          param: 'q',
          location: 'query',
          value: 'true',
        });
        return done();
      });
  });

  it('response with 200 because q param is optional', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit: 10 })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

afterAll(async () => {
  connection.close();
  server.close();
});