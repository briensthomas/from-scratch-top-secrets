const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const fakeUser = {
  first_name: 'Fake',
  last_name: 'User',
  email: 'test@example.com',
  password: '123456'
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('#POST creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(fakeUser);
    const { first_name, last_name, email } = fakeUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      first_name,
      last_name,
      email
    });
  });

  it('#POST sign in an existing user', async () => {
    await request(app).post('/api/v1/users/').send(fakeUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(200);
  });

  it('#DELETE /sessions cookie', async () => {
    await request(app).post('/api/v1/users/').send(fakeUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(200);
    // Do the opposite after calling delete route?
    
    const deleteRes = await request(app).delete('/api/v1/users/');
    expect(deleteRes.status).toBe(404);


  });


  afterAll(() => {
    pool.end();
  });

});
