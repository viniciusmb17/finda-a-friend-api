import { PetsRepository } from '@/repositories/pets-repository'
import { Pet, Prisma } from '@prisma/client'

type CreatePetUseCaseRequest = Prisma.PetUncheckedCreateInput

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    name,
    about,
    age,
    energy_level,
    environment,
    independence_level,
    size,
    images_url,
    requirements,
    organization_id,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      energy_level,
      environment,
      independence_level,
      size,
      images_url,
      requirements,
      organization_id,
    })

    return { pet }
  }
}
