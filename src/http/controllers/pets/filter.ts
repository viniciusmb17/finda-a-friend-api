import { makeFetchOrganizationsByCityUseCase } from '@/use-cases/factories/make-fetch-organizations-by-city-use-case'
import { makeFetchPetsByOrganizationsIdsAndFilterUseCase } from '@/use-cases/factories/make-fetch-pets-by-organizations-ids-and-filters-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function filter(request: FastifyRequest, reply: FastifyReply) {
  const filterPetsQuerySchema = z.object({
    city: z.string(),
    age: z.enum(['PUPPY', 'ADULT', 'OLD']).optional(),
    energy_level: z
      .enum(['VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'])
      .optional(),
    independence_level: z.enum(['LOW', 'MODERATE', 'HIGH']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    page: z.coerce.number().min(1).default(1),
  })

  const { city, age, energy_level, independence_level, size, page } =
    filterPetsQuerySchema.parse(request.query)

  const fetchOrganizationsByCityUseCase = makeFetchOrganizationsByCityUseCase()
  const fetchPetsByOrganizationsIdsAndFilterUseCase =
    makeFetchPetsByOrganizationsIdsAndFilterUseCase()

  const { organizations } = await fetchOrganizationsByCityUseCase.execute({
    city,
  })

  const organizationsIds = organizations.map((item) => item.id)

  const { pets } = await fetchPetsByOrganizationsIdsAndFilterUseCase.execute({
    organizationsIds,
    filter: {
      age,
      energyLevel: energy_level,
      independenceLevel: independence_level,
      size,
    },
    page,
  })

  return reply.status(200).send({
    pets,
  })
}
