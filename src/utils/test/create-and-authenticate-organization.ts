import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
  await prisma.organization.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      cep: '37950000',
      address: 'address',
      whatsapp_number: '99 99999-9999',
      password_hash: await hash('123456', 6),
      city: 'city',
      state: 'state',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
