import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { Organization } from '@prisma/client'

interface FetchOrganizationsByCityUseCaseRequest {
  city: string
}

interface FetchOrganizationsByCityUseCaseResponse {
  organizations: Organization[]
}

export class FetchOrganizationsByCityUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    city,
  }: FetchOrganizationsByCityUseCaseRequest): Promise<FetchOrganizationsByCityUseCaseResponse> {
    const organizations = await this.organizationsRepository.findManyByCity(
      city,
    )

    return { organizations }
  }
}
