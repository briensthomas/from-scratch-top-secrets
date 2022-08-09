const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeUser = {
  first_name: 'Fake',
  last_name: 'User',
  email: 'test@example.com',
  password: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? fakeUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...fakeUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('#POST creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(fakeUser);
    const { email } = fakeUser;
    expect(res.body).toEqual({
      id: expect.any(String),
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

  // it('#DELETE /sessions cookie', async () => {
  //   await request(app).post('/api/v1/users/').send(fakeUser);
  //   const res = await request(app)
  //     .post('/api/v1/users/sessions')
  //     .send({ email: 'test@example.com', password: '123456' });

  //   expect(res.status).toBe(200);
  //   // Do the opposite after calling delete route?

  //   const deleteRes = await request(app).delete('/api/v1/users/');
  //   console.log('Test console:', deleteRes);
  //   expect(deleteRes.body).toEqual({ success: true, message: 'Signed out successfully!' });


  // });

  it('#GET protected /secrets should return list of secrets for auth user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toBe(200);
  });

  it('#POST auth users can send new secrets', async () => {
    const newSecret = {
      title: 'Brien\'s Secret',
      description: 'Sometimes I don\'t make my bed'
    };
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/secrets').send(newSecret);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      created_at: expect.anything()
    });
  });


  afterAll(() => {
    pool.end();
  });

});
