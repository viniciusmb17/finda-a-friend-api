import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { CreateOrganizationUseCase } from './create-organization'
import { compare } from 'bcryptjs'
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists-error'
import { CepApiError } from './errors/cep-api-error'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: CreateOrganizationUseCase // sut => System Under Test

describe('Create Organization Use Case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new CreateOrganizationUseCase(organizationsRepository)
  })

  it('should be able to create organization', async () => {
    const { organization } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: 'Rua Example, 999',
      cep: '37950000',
      password: '123456',
      whatsappNumber: '99 99999-9999',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should hash organization password upon registration', async () => {
    const { organization } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: 'Rua Example, 999',
      cep: '37950000',
      password: '123456',
      whatsappNumber: '99 99999-9999',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      organization.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      address: 'Rua Example, 999',
      cep: '37950000',
      password: '123456',
      whatsappNumber: '99 99999-9999',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        address: 'Rua Example, 999',
        cep: '37953036',
        password: '123456',
        whatsappNumber: '99 99999-9999',
      }),
    ).rejects.toBeInstanceOf(OrganizationAlreadyExistsError)
  })

  it('should not be able to use an invalid cep', async () => {
    const invalidCep = '99999999'

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        address: 'Rua Example, 999',
        cep: invalidCep,
        password: '123456',
        whatsappNumber: '99 99999-9999',
      }),
    ).rejects.toBeInstanceOf(CepApiError)
  })
})
