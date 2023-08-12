import { Prisma, Organization } from '@prisma/client'

export interface OrganizationsRepository {
  findManyByCity(city: string): Promise<Organization[]>
  findById(id: string): Promise<Organization | null>
  findByEmail(email: string): Promise<Organization | null>
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>
}
