import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetsByOrganizationsIdsUseCase } from '../get-pets-by-organizations-ids'

export function makeGetPetsByOrganizationsIdsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const useCase = new GetPetsByOrganizationsIdsUseCase(petsRepository)

  return useCase
}
