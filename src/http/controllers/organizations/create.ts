import { OrganizationAlreadyExistsError } from '@/use-cases/errors/organization-already-exists-error'
import { makeCreateOrganizationUseCase } from '@/use-cases/factories/make-create-organization-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrganizationBodySchema = z
    .object({
      name: z.string(),
      email: z.string().email(),
      cep: z
        .string()
        .transform((cep) => cep.replace(/\D/g, ''))
        .refine((cep) => /^\d{8}$/.test(cep)),
      address: z.string(),
      whatsappNumber: z
        .string()
        .min(11, { message: 'It must have at least 11 characters' }),
      password: z.string(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })

  const { name, password, email, address, cep, whatsappNumber } =
    createOrganizationBodySchema.parse(request.body)

  try {
    const createOrganizationUseCase = makeCreateOrganizationUseCase()

    await createOrganizationUseCase.execute({
      name,
      password,
      email,
      address,
      cep,
      whatsappNumber,
    })
  } catch (error) {
    if (error instanceof OrganizationAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
