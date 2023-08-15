import { FastifyInstance } from 'fastify'
import { create } from './create'
import { filter } from './filter'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', filter)

  // TODO
  // app.get('/pets/:id', details)

  /** Authenticated */
  app.post('/pets', { onRequest: [verifyJWT] }, create)
}
