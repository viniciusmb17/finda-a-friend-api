import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

describe('Filter (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to filter pets by city', async () => {
    const orgTest = await prisma.organization.create({
      data: {
        name: 'Org Test',
        email: 'orgtest@example.com',
        cep: '37950000',
        address: 'address',
        whatsapp_number: '99 99999-9999',
        password_hash: await hash('123456', 6),
        city: 'city2',
        state: 'state',
      },
    })

    await prisma.pet.create({
      data: {
        name: 'Bob4 From Different City',
        about: '',
        age: 'ADULT',
        energy_level: 'HIGH',
        environment: '',
        independence_level: 'HIGH',
        size: 'LARGE',
        images_url: ['url/path/test'],
        requirements: ['req 01', 'req 02'],
        organization_id: orgTest.id,
      },
    })

    const { token } = await createAndAuthenticateOrganization(app)

    await request(app.server)
      .post('/pets')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Bob',
        about: '',
        age: 'OLD',
        energy_level: 'HIGH',
        environment: '',
        independence_level: 'HIGH',
        size: 'LARGE',
        images_url: ['url/path/test'],
        requirements: ['req 01', 'req 02'],
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Bob2',
        about: '',
        age: 'ADULT',
        energy_level: 'HIGH',
        environment: '',
        independence_level: 'LOW',
        size: 'LARGE',
        images_url: ['url/path/test'],
        requirements: ['req 01', 'req 02'],
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Bob3',
        about: '',
        age: 'ADULT',
        energy_level: 'HIGH',
        environment: '',
        independence_level: 'LOW',
        size: 'SMALL',
        images_url: ['url/path/test'],
        requirements: ['req 01', 'req 02'],
      })

    const responseFilterByAllFields = await request(app.server)
      .get('/pets')
      .query({
        city: 'city',
        age: 'OLD',
        energy_level: 'HIGH',
        independence_level: 'HIGH',
        size: 'LARGE',
      })

    const responseFilterAge = await request(app.server).get('/pets').query({
      city: 'city',
      age: 'OLD',
    })

    const responseFilterByIndependenceLevel = await request(app.server)
      .get('/pets')
      .query({
        city: 'city',
        independence_level: 'HIGH',
      })

    const responseFilterByEnergyLevel = await request(app.server)
      .get('/pets')
      .query({
        city: 'city',
        energy_level: 'HIGH',
      })

    const responseFilterBySize = await request(app.server).get('/pets').query({
      city: 'city',
      size: 'LARGE',
    })

    const responseFilterOnlyByCity = await request(app.server)
      .get('/pets')
      .query({
        city: 'city',
      })

    expect(responseFilterByAllFields.statusCode).toEqual(200)
    expect(responseFilterAge.statusCode).toEqual(200)
    expect(responseFilterByEnergyLevel.statusCode).toEqual(200)
    expect(responseFilterByIndependenceLevel.statusCode).toEqual(200)
    expect(responseFilterBySize.statusCode).toEqual(200)
    expect(responseFilterOnlyByCity.statusCode).toEqual(200)
  })

  it.only('should not be able to filter pets without city', async () => {
    const orgTestB = await prisma.organization.create({
      data: {
        name: 'Org Test B',
        email: 'orgtest_b@example.com',
        cep: '37950000',
        address: 'address',
        whatsapp_number: '99 99999-9999',
        password_hash: await hash('123456', 6),
        city: 'city',
        state: 'state',
      },
    })

    await prisma.pet.create({
      data: {
        name: 'Bob',
        about: '',
        age: 'ADULT',
        energy_level: 'HIGH',
        environment: '',
        independence_level: 'HIGH',
        size: 'LARGE',
        images_url: ['url/path/test'],
        requirements: ['req 01', 'req 02'],
        organization_id: orgTestB.id,
      },
    })

    const response = await request(app.server).get('/pets').query({
      age: 'ADULT',
      energy_level: 'HIGH',
      independence_level: 'HIGH',
      size: 'LARGE',
    })

    expect(response.statusCode).toEqual(400)
    expect(response).toEqual(expect.objectContaining({ clientError: true }))
    expect(response.body).toEqual(
      expect.objectContaining({
        issues: expect.objectContaining({ city: { _errors: ['Required'] } }),
      }),
    )
  })
})
