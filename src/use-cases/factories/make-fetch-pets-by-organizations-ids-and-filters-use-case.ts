import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { FetchPetsByOrganizationsIdsAndFilterUseCase } from '../fetch-pets-by-organizations-ids-and-filters'

export function makeFetchPetsByOrganizationsIdsAndFilterUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const useCase = new FetchPetsByOrganizationsIdsAndFilterUseCase(
    petsRepository,
  )

  return useCase
}
