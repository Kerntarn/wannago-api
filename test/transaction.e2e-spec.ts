import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module'; // <-- ใช้ AppModule จริง

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transaction/create (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/transaction/create')
      .send({
        purpose: 'Hotel b2b',
        status: 'pending',
        amount: 22000,
        method: 'QR Payment',
        userId: '64fca1f8f5a2b7ftransactionCreate', // mock id
      })
      .expect(HttpStatus.CREATED);

    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('_id');

    createdId = res.body.data._id;
  });

  it('/transaction/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/transaction/${createdId}`)
      .expect(HttpStatus.OK);

    expect(res.body).toHaveProperty('_id', createdId);
    expect(res.body).toHaveProperty('purpose', 'Hotel b2b');
  });

  it('/transaction/change-payment-method/:id (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/transaction/change-payment-method/${createdId}`)
      .send({ method: 'Mobile Banking' })
      .expect(HttpStatus.OK);

    expect(res.body.data).toHaveProperty('method', 'Mobile Banking');
  });

  it('/transaction/accept-transaction/:id (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/transaction/accept-transaction/${createdId}`)
      .send({ status: 'accepted', payDate: '2025-03-17T12:00:00Z' })
      .expect(HttpStatus.OK);

    expect(res.body).toHaveProperty('message');
    expect(res.body.data).toHaveProperty('status', 'accepted');
  });

  it('/transaction/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/transaction/${createdId}`)
      .expect(HttpStatus.OK);

    expect(res.body).toHaveProperty('message');
    expect(res.body.data).toHaveProperty('_id', createdId);
  });
});
