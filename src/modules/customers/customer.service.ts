import prisma from '../../config/db';
import { AppError } from '../../utils/errors';
import { Prisma } from '@prisma/client';

export class CustomerService {
  public static async createCustomer(businessId: string, data: any) {
    return await prisma.customer.create({
      data: {
        ...data,
        businessId,
      },
    });
  }

  public static async getCustomers(businessId: string, query: any) {
    const { page, limit, search, gender, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {
      businessId,
      deletedAt: null,
    };

    if (gender) {
      where.gender = { equals: gender, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, customers] = await prisma.$transaction([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
    ]);

    return {
      customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async getCustomerById(businessId: string, id: string) {
    const customer = await prisma.customer.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
      include: {
        measurements: {
          where: { deletedAt: null }
        },
        orders: {
          where: { deletedAt: null }
        }
      }
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return customer;
  }

  public static async updateCustomer(businessId: string, id: string, data: any) {
    const customer = await prisma.customer.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return await prisma.customer.update({
      where: { id },
      data,
    });
  }

  public static async deleteCustomer(businessId: string, id: string) {
    const customer = await prisma.customer.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
