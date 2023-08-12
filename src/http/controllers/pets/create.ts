import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    environment: z.string(),
    age: z.enum(['PUPPY', 'ADULT', 'OLD']),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    energy_level: z.enum(['VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']),
    independence_level: z.enum(['LOW', 'MODERATE', 'HIGH']),
    images_url: z.string().array(),
    requirements: z.string().array(),
  })

  const {
    name,
    about,
    age,
    energy_level,
    environment,
    images_url,
    independence_level,
    requirements,
    size,
  } = createPetBodySchema.parse(request.body)

  const organizationId = request.user.sub

  const createPetUseCase = makeCreatePetUseCase()

  await createPetUseCase.execute({
    name,
    about,
    age,
    energy_level,
    environment,
    images_url,
    independence_level,
    organization_id: organizationId,
    requirements,
    size,
  })

  return reply.status(201).send()
}
