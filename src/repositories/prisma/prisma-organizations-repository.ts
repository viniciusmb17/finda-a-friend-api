import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { OrganizationsRepository } from '../organizations-repository'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async findManyByCity(city: string) {
    const organizations = await prisma.organization.findMany({
      where: {
        city,
      },
    })

    return organizations
  }

  async findById(id: string) {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
    })

    return organization
  }

  async findByEmail(email: string) {
    const organization = await prisma.organization.findUnique({
      where: {
        email,
      },
    })

    return organization
  }

  async create(data: Prisma.OrganizationCreateInput) {
    const organization = await prisma.organization.create({ data })

    return organization
  }
}
