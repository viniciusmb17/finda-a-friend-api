import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists-error'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import cepApi from 'cep-promise'
import { CepApiError } from './errors/cep-api-error'

interface CreateOrganizationRequest {
  name: string
  email: string
  cep: string
  address: string
  whatsappNumber: string
  password: string
}
interface CreateOrganizationResponse {
  organization: Organization
}

export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    name,
    email,
    cep,
    address,
    whatsappNumber,
    password,
  }: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const password_hash = await hash(password, 6)

    const organizationWithSameEmail =
      await this.organizationsRepository.findByEmail(email)

    if (organizationWithSameEmail) {
      throw new OrganizationAlreadyExistsError()
    }

    const { city, state } = await cepApi(cep).catch((error) => {
      throw new CepApiError(error.message)
    })

    const organization = await this.organizationsRepository.create({
      name,
      email,
      cep,
      address,
      whatsapp_number: whatsappNumber,
      password_hash,
      city,
      state,
    })

    return { organization }
  }
}
