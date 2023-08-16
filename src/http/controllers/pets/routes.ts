import { FastifyInstance } from 'fastify'
import { create } from './create'
import { filter } from './filter'
import { details } from './details'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', filter)
  app.get('/pets/:id', details)

  /** Authenticated */
  app.post('/pets', { onRequest: [verifyJWT] }, create)
}
