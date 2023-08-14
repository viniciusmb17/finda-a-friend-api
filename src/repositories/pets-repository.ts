import {
  Age,
  EnergyLevel,
  IndependenceLevel,
  Size,
  Pet,
  Prisma,
} from '@prisma/client'

export type FilterOptionsType = {
  age?: Age
  energyLevel?: EnergyLevel
  independenceLevel?: IndependenceLevel
  size?: Size
}

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  findManyByOrganizationsIdsAndFilter(
    organizationsIds: string[],
    filter: FilterOptionsType,
    page: number,
  ): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
