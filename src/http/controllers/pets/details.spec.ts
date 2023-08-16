import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

describe('Details (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet details', async () => {
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

    const pet = await prisma.pet.create({
      data: {
        name: 'Bob Details',
        about: 'about info',
        age: 'ADULT',
        energy_level: 'HIGH',
        environment: 'env info',
        independence_level: 'HIGH',
        size: 'LARGE',
        images_url: ['url/path/test'],
        requirements: ['req 01', 'req 02'],
        organization_id: orgTest.id,
      },
    })

    const response = await request(app.server).get(`/pets/${pet.id}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        name: 'Bob Details',
        organization_id: orgTest.id,
      }),
    )
  })
})
