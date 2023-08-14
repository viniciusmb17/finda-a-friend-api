import { FastifyInstance } from 'fastify'
import { create } from './create'
import { authenticate } from './authenticate'
import { refresh } from './refresh'

export async function organizationsRoutes(app: FastifyInstance) {
  app.post('/organizations', create)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)
}
