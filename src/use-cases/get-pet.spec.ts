import { beforeAll, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { GetPetUseCase } from './get-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository

let sut: GetPetUseCase // sut => System Under Test

describe('Get Pet Use Case', () => {
  beforeAll(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()

    sut = new GetPetUseCase(petsRepository) // sut => System Under Test
  })

  it('should be able to get pet by id', async () => {
    const organization = await organizationsRepository.create({
      name: 'John Doe A',
      email: 'johndoe_a@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'cityA',
      state: 'state',
    })

    const { id: petId } = await petsRepository.create({
      name: 'Bob',
      about: '',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: '',
      independence_level: 'HIGH',
      size: 'LARGE',
      images_url: ['url/path/test'],
      requirements: ['req 01', 'req 02'],
      organization_id: organization.id,
    })

    const { pet } = await sut.execute({
      petId,
    })

    expect(pet).toEqual(
      expect.objectContaining({
        name: 'Bob',
        age: 'ADULT',
        energy_level: 'HIGH',
        independence_level: 'HIGH',
        organization_id: organization.id,
      }),
    )
  })

  it('should not be able to get pet with wrong id', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
