import { Organization } from '@prisma/client'
import { OrganizationsRepository } from '../repositories/organizations-repository'
import { hash } from 'bcryptjs'
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists-error'

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

export class CreateOrgUseCase {
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

    const organization = await this.organizationsRepository.create({
      name,
      email,
      cep,
      address,
      whatsapp_number: whatsappNumber,
      password_hash,
      city: 'none',
      state: 'none',
    })

    return { organization }
  }
}
