import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface FetchPetsByOrganizationsIdsUseCaseRequest {
  organizationsIds: string[]
}

interface FetchPetsByOrganizationsIdsUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByOrganizationsIdsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    organizationsIds,
  }: FetchPetsByOrganizationsIdsUseCaseRequest): Promise<FetchPetsByOrganizationsIdsUseCaseResponse> {
    const pets = await this.petsRepository.findManyByOrganizationsIds(
      organizationsIds,
    )

    return { pets }
  }
}
