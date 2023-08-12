import { beforeAll, describe, expect, it } from 'vitest'
import { FetchPetsByOrganizationsIdsUseCase } from './fetch-pets-by-organizations-ids'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { hash } from 'bcryptjs'
import { FetchOrganizationsByCityUseCase } from './fetch-organizations-by-city'

let organizationsRepository: InMemoryOrganizationsRepository

let sut: FetchOrganizationsByCityUseCase // sut => System Under Test

describe('Fetch Organizations By City Use Case', () => {
  beforeAll(async () => {
    organizationsRepository = new InMemoryOrganizationsRepository()

    sut = new FetchOrganizationsByCityUseCase(organizationsRepository) // sut => System Under Test
  })

  it('should be able to fetch pets by organizations ids', async () => {
    const organizationA = await organizationsRepository.create({
      name: 'John Doe A',
      email: 'johndoe_a@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'cityA',
      state: 'state',
    })

    const organizationB = await organizationsRepository.create({
      name: 'John Doe B',
      email: 'johndoe_b@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'cityA',
      state: 'state',
    })

    const organizationC = await organizationsRepository.create({
      name: 'John Doe C',
      email: 'johndoe_b@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'cityB',
      state: 'state',
    })

    const organizationsFromCityA = await organizationsRepository.findManyByCity(
      'cityA',
    )

    const organizationsFromCityB = await organizationsRepository.findManyByCity(
      'cityB',
    )

    const organizationsFromCityC = await organizationsRepository.findManyByCity(
      'cityC',
    )

    expect(organizationsFromCityA).toHaveLength(2)
    expect(organizationsFromCityA).toEqual([
      expect.objectContaining({ id: organizationA.id, city: 'cityA' }),
      expect.objectContaining({ id: organizationB.id, city: 'cityA' }),
    ])

    expect(organizationsFromCityB).toHaveLength(1)
    expect(organizationsFromCityB).toEqual([
      expect.objectContaining({ id: organizationC.id, city: 'cityB' }),
    ])

    expect(organizationsFromCityC).toHaveLength(0)
    expect(organizationsFromCityC).toEqual([])
  })
})
