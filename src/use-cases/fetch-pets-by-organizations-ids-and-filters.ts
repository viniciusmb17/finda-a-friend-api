import {
  FilterOptionsType,
  PetsRepository,
} from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface FetchPetsByOrganizationsIdsAndFilterUseCaseRequest {
  organizationsIds: string[]
  filter: FilterOptionsType
  page: number
}

interface FetchPetsByOrganizationsIdsAndFilterUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByOrganizationsIdsAndFilterUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    organizationsIds,
    filter,
    page,
  }: FetchPetsByOrganizationsIdsAndFilterUseCaseRequest): Promise<FetchPetsByOrganizationsIdsAndFilterUseCaseResponse> {
    const pets = await this.petsRepository.findManyByOrganizationsIdsAndFilter(
      organizationsIds,
      filter,
      page,
    )

    return { pets }
  }
}
