import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an organization', async () => {
    const response = await request(app.server).post('/organizations').send({
      name: 'John Doe',
      password: '123456',
      confirmPassword: '123456',
      email: 'johndoe@example.com',
      address: 'Rua teste',
      cep: '37950000',
      whatsappNumber: '99 99999-9999',
    })

    expect(response.statusCode).toEqual(201)
  })
})
