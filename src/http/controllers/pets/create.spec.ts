import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Create (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const { token } = await createAndAuthenticateOrganization(app)

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Bob',
        about: '',
        age: 'ADULT',
        energy_level: 'HIGH',
        environment: '',
        independence_level: 'HIGH',
        size: 'LARGE',
        images_url: ['url/path/test'],
        requirements: ['req 01', 'req 02'],
      })

    expect(response.statusCode).toEqual(201)
  })
})
