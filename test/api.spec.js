const { app, server } = require('../app');
const connection = require('mongoose').connection;
const Commerce = require('../models/store');
const supertest = require('supertest');
const commerceSeed = require('../models/seed/storeSeed.json');


const commerce1 = {
  name: 'Thiel LLC',
  cuit: '590731538-5',
  concepts: [68634, 89470, 29975, 33031, 91956, 13398],
  currentBalance: 79650,
  active: true,
  lastSale: '2018-10-14',
};

const commerce2 = {
  name: 'Graham, Brekke and Ritchie',
  cuit: '034786834-7',
  concepts: [68848, 8082, 2135, 79594, 58137, 14527],
  currentBalance: 100248,
  active: true,
  lastSale: '2018-08-08'
};

const request = supertest(app);

describe('Testing response to valid POST requests', function () {
  afterEach(async () => {
    await Commerce.deleteMany();
  });

  it('response with empty data if db is empty', (done) => {
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit: 10 })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveLength(0);
        expect(res.body).toEqual({
          data: [],
          page: 1,
          total: 0,
          limit: 10,
          pages: 0,
        });
        expect(res.body).not.toHaveProperty('errors');
        return done();
      });
  });
  
  it('response with Created and save data in db', async () => {
    await request
      .post('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .send(commerce1)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body.success).toBeTruthy();
        expect(res.body.message).toBe('Created successfully');
        const data = res.body.data;
        expect(data.name).toEqual(commerce1.name);
        expect(data.cuit).toEqual(commerce1.cuit);
        expect(data.active).toEqual(commerce1.active);
        expect(data.lastSale).toEqual('2018-10-14T00:00:00.000Z');
        expect(data.currentBalance).toEqual(commerce1.currentBalance);
        expect(data.concepts).toEqual(commerce1.concepts);
        return;
      });
    await request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit: 10 })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.total).toEqual(1);
        expect(res.body.pages).toEqual(1);
        expect(res.body.data).toHaveLength(1);
        return;
      });
    return;
  });

  it('response with Created and save in db on 2 request', async () => {
    await request
      .post('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .send(commerce1)
      .expect('Content-Type', /json/)
      .expect(201);
    await request
      .post('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .send(commerce2)
      .expect('Content-Type', /json/)
      .expect(201);
    await request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit: 10 })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.total).toEqual(2);
        expect(res.body.pages).toEqual(1);
        expect(res.body.data).toHaveLength(2);
        return;
      });
    return;
  });
});

describe('Testing response to valid GET requests', function() {
  beforeAll(async () => {
    await Commerce.create(commerceSeed);
  });
  
  const total = commerceSeed.length;

  it('response with 100 rows', done => {
    const limit = 100;
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveLength(limit);
        expect(res.body.total).toEqual(total);
        expect(res.body.pages).toEqual(Math.ceil(total/limit));
        expect(res.body.limit).toEqual(limit);
        expect(res.body.page).toEqual(1);
        return done();
      });
  });
  it('response with 10 rows', done => {
    const limit = 10;
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveLength(limit);
        expect(res.body.total).toEqual(total);
        expect(res.body.pages).toEqual(Math.ceil(total/limit));
        expect(res.body.limit).toEqual(limit);
        return done();
      });
  });
  it('response with filtered rows', done => {
    const limit = 100;
    const filteredRows = commerceSeed.filter(row => row.name.indexOf('g') >= 0).length;
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit, q: '{"name":{"$regex":"g"}}' })
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveLength(filteredRows);
        expect(res.body.total).toEqual(filteredRows);
        expect(res.body.pages).toEqual(1);
        expect(res.body.limit).toEqual(limit);
        return done();
      });
  });
  it('response with filtered rows formatted in pages', done => {
    const limit = 10;
    const filteredRows = commerceSeed.filter(row => row.name.indexOf('g') >= 0).length;
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit, q: JSON.stringify({ name: {$regex: 'g'}}) })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveLength(limit);
        expect(res.body.total).toEqual(filteredRows);
        expect(res.body.pages).toEqual(Math.ceil(filteredRows/limit));
        expect(res.body.limit).toEqual(limit);
        return done();
      });
  });
  
  it('response with filtered rows formatted in pages for multiples filters', done => {
    const limit = 10;
    const filteredRows = commerceSeed.filter(row => row.name.indexOf('g') >= 0 || row.cuit.indexOf('-1') >= 0).length;
    request
      .get('/api/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic dGVzdEBrb2liYW54LmNvbTphZG1pbg==')
      .query({ page: 1, sort: 'id', limit, q: JSON.stringify({$or: [{name:{$regex:'g'}}, {cuit: {$regex: '-1'}}]}) })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.data).toHaveLength(limit);
        expect(res.body.total).toEqual(filteredRows);
        expect(res.body.pages).toEqual(Math.ceil(filteredRows/limit));
        expect(res.body.limit).toEqual(limit);
        return done();
      });
  });
  afterAll(async () => {
    await Commerce.deleteMany();
  });
});

afterAll(async () => {
  connection.close();
  server.close();
});