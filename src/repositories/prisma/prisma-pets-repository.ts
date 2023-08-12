import { Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async findManyByOrganizationsIds(organizationsIds: string[]) {
    const pets = await prisma.pet.findMany({
      where: {
        organization_id: {
          in: organizationsIds,
        },
      },
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({ data })

    return pet
  }
}
