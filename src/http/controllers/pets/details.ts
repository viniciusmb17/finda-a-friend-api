import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getPetDetailsUseCase = makeGetPetDetailsUseCase()

  const getPetDetailsParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getPetDetailsParamsSchema.parse(request.params)

  try {
    const { pet } = await getPetDetailsUseCase.execute({
      petId: id,
    })

    return reply.status(200).send({
      pet,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
