import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

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
