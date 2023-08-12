import { beforeAll, describe, expect, it } from 'vitest'
import { FetchPetsByOrganizationsIdsUseCase } from './fetch-pets-by-organizations-ids'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository

let sut: FetchPetsByOrganizationsIdsUseCase // sut => System Under Test

describe('Fetch Pets By Organizations Ids Use Case', () => {
  beforeAll(async () => {
    petsRepository = new InMemoryPetsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()

    sut = new FetchPetsByOrganizationsIdsUseCase(petsRepository) // sut => System Under Test
  })

  it('should be able to fetch pets by organizations ids', async () => {
    const organizationA = await organizationsRepository.create({
      name: 'John Doe A',
      email: 'johndoe_a@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'city',
      state: 'state',
    })

    const organizationB = await organizationsRepository.create({
      name: 'John Doe B',
      email: 'johndoe_b@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'city',
      state: 'state',
    })

    const organizationC = await organizationsRepository.create({
      name: 'John Doe C',
      email: 'johndoe_b@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'city',
      state: 'state',
    })

    await petsRepository.create({
      name: 'Bob',
      about: '',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: '',
      independence_level: 'HIGH',
      size: 'LARGE',
      images_url: ['url/path/test'],
      requirements: ['req 01', 'req 02'],
      organization_id: organizationA.id,
    })

    await petsRepository.create({
      name: 'Bob2',
      about: '',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: '',
      independence_level: 'HIGH',
      size: 'LARGE',
      images_url: ['url/path/test'],
      requirements: ['req 01', 'req 02'],
      organization_id: organizationA.id,
    })

    await petsRepository.create({
      name: 'Bob3',
      about: '',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: '',
      independence_level: 'HIGH',
      size: 'LARGE',
      images_url: ['url/path/test'],
      requirements: ['req 01', 'req 02'],
      organization_id: organizationB.id,
    })

    await petsRepository.create({
      name: 'Bob4',
      about: '',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: '',
      independence_level: 'HIGH',
      size: 'LARGE',
      images_url: ['url/path/test'],
      requirements: ['req 01', 'req 02'],
      organization_id: organizationB.id,
    })

    const { pets } = await sut.execute({
      organizationsIds: [organizationA.id, organizationB.id, organizationC.id],
    })

    expect(pets).toHaveLength(4)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Bob' }),
      expect.objectContaining({ name: 'Bob2' }),
      expect.objectContaining({ name: 'Bob3' }),
      expect.objectContaining({ name: 'Bob4' }),
    ])
  })
})
