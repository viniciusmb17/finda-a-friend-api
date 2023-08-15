import { FetchOrganizationsByCityUseCase } from '../fetch-organizations-by-city'
import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'

export function makeFetchOrganizationsByCityUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()
  const useCase = new FetchOrganizationsByCityUseCase(organizationsRepository)

  return useCase
}
