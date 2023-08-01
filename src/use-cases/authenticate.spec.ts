import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists-error'
import { CepApiError } from './errors/cep-api-error'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: AuthenticateUseCase // sut => System Under Test

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new AuthenticateUseCase(organizationsRepository)
  })

  it('should be able to authenticate', async () => {
    await organizationsRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'city',
      state: 'state',
    })

    const { organization } = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with an invalid email', async () => {
    await organizationsRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'city',
      state: 'state',
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe2@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with an invalid password', async () => {
    await organizationsRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      address: 'Rua Example, 999',
      cep: '37953036',
      password_hash: await hash('123456', 6),
      whatsapp_number: '99 99999-9999',
      city: 'city',
      state: 'state',
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@email.com',
        password: '99999999',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
