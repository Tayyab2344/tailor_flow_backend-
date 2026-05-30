import prisma from '../../config/db';
import { AppError } from '../../utils/errors';

export class MeasurementService {
  private static async verifyCustomerBelongsToBusiness(customerId: string, businessId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, businessId, deletedAt: null },
    });
    if (!customer) {
      throw new AppError('Customer not found or access denied', 404);
    }
  }

  public static async createMeasurement(businessId: string, data: any) {
    await this.verifyCustomerBelongsToBusiness(data.customerId, businessId);

    return await prisma.measurement.create({
      data: {
        customerId: data.customerId,
        templateName: data.templateName,
        gender: data.gender,
        measurementData: data.measurementData,
        notes: data.notes,
        referenceImages: data.referenceImages,
      },
    });
  }

  public static async getMeasurements(businessId: string, customerId?: string) {
    // If customerId is provided, get for that customer, else get all for the business
    const where: any = {
      deletedAt: null,
      customer: {
        businessId,
        deletedAt: null,
      },
    };

    if (customerId) {
      where.customerId = customerId;
    }

    return await prisma.measurement.findMany({
      where,
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public static async getMeasurementById(businessId: string, id: string) {
    const measurement = await prisma.measurement.findFirst({
      where: {
        id,
        deletedAt: null,
        customer: {
          businessId,
          deletedAt: null,
        },
      },
      include: {
        customer: true,
      },
    });

    if (!measurement) {
      throw new AppError('Measurement record not found', 404);
    }

    return measurement;
  }

  public static async updateMeasurement(businessId: string, id: string, data: any) {
    const measurement = await prisma.measurement.findFirst({
      where: {
        id,
        deletedAt: null,
        customer: {
          businessId,
          deletedAt: null,
        },
      },
    });

    if (!measurement) {
      throw new AppError('Measurement record not found', 404);
    }

    return await prisma.measurement.update({
      where: { id },
      data,
    });
  }

  public static async deleteMeasurement(businessId: string, id: string) {
    const measurement = await prisma.measurement.findFirst({
      where: {
        id,
        deletedAt: null,
        customer: {
          businessId,
          deletedAt: null,
        },
      },
    });

    if (!measurement) {
      throw new AppError('Measurement record not found', 404);
    }

    return await prisma.measurement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
