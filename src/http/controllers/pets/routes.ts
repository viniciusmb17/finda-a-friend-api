import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
  /** Authenticated */
  app.post('/pets', { onRequest: [verifyJWT] }, create)
}
