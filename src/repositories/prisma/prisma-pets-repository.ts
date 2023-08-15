import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { FilterOptionsType, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findManyByOrganizationsIdsAndFilter(
    organizationsIds: string[],
    filter: FilterOptionsType,
    page: number,
  ) {
    const hasFilterAge = !!filter.age
    const hasFilterEnergyLevel = !!filter.energyLevel
    const hasFilterIndependenceLevel = !!filter.independenceLevel
    const hasFilterSize = !!filter.size
    const itemsPerPage = 20

    const pets = await prisma.pet.findMany({
      where: {
        AND: [
          {
            organization_id: {
              in: organizationsIds,
            },
          },

          // Optional Filters
          hasFilterAge ? { age: filter.age } : {},
          hasFilterEnergyLevel ? { energy_level: filter.energyLevel } : {},
          hasFilterIndependenceLevel
            ? { independence_level: filter.independenceLevel }
            : {},
          hasFilterSize ? { size: filter.size } : {},
        ],
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }
}
