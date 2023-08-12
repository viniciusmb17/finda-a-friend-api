import { Pet, Prisma } from '@prisma/client'

export interface PetsRepository {
  findManyByOrganizationsIds(organizationsIds: string[]): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
