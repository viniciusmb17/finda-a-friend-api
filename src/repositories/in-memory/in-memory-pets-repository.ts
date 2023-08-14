import { Pet, Prisma } from '@prisma/client'
import { FilterOptionsType, PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findManyByOrganizationsIdsAndFilter(
    organizationsIds: string[],
    filterOptions: FilterOptionsType,
    page: number,
  ) {
    return this.items
      .filter((item) => organizationsIds.includes(item.organization_id))
      .filter((item) => {
        let match = true

        if (filterOptions?.age) {
          match = match && item.age === filterOptions?.age
        }

        if (filterOptions?.energyLevel) {
          match = match && item.energy_level === filterOptions?.energyLevel
        }

        if (filterOptions?.independenceLevel) {
          match =
            match &&
            item.independence_level === filterOptions?.independenceLevel
        }

        if (filterOptions?.size) {
          match = match && item.size === filterOptions?.size
        }

        return match
      })
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      environment: data.environment,
      energy_level: data.energy_level,
      images_url: data.images_url as Prisma.JsonValue[],
      independence_level: data.independence_level,
      requirements: data.requirements as Prisma.JsonValue[],
      size: data.size,
      organization_id: data.organization_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(pet)

    return pet
  }
}
