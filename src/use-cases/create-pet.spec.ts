import { describe, expect, it, beforeEach } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { hash } from 'bcryptjs'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository

let sut: CreatePetUseCase // sut => System Under Test

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new CreatePetUseCase(petsRepository)
  })

  it('should be able to create a pet', async () => {
    const organization = await organizationsRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: 'Rua Example, 999',
      cep: '37950000',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'city',
      state: 'state',
    })

    const { pet } = await sut.execute({
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

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.organization_id).toEqual(organization.id)
  })
})
