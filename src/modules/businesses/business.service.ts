import prisma from '../../config/db';
import { AppError } from '../../utils/errors';

export class BusinessService {
  public static async createBusiness(userId: string, data: any) {
    // Check if user already has a business
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);
    if (user.businessId) {
      throw new AppError('User is already associated with a business', 400);
    }

    return await prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data,
      });

      // Update user's business association
      await tx.user.update({
        where: { id: userId },
        data: { businessId: business.id },
      });

      // Create default settings
      await tx.settings.create({
        data: {
          businessId: business.id,
          workflowSettings: {
            stages: [
              'PENDING',
              'MEASURING',
              'CUTTING',
              'STITCHING',
              'EMBROIDERY',
              'IRONING',
              'QUALITY_CHECK',
              'READY',
              'DELIVERED'
            ]
          },
          currency: data.currency || 'USD',
          language: data.language || 'en',
          theme: 'dark',
          notificationSettings: { sms: true, email: true, whatsapp: false },
          businessPreferences: { enableInvoicePdf: true, defaultTaxRate: 0.05 }
        }
      });

      return business;
    });
  }

  public static async getBusiness(businessId: string | null) {
    if (!businessId) {
      throw new AppError('User is not associated with any business', 400);
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.deletedAt) {
      throw new AppError('Business not found or suspended', 404);
    }

    return business;
  }

  public static async updateBusiness(businessId: string | null, data: any) {
    if (!businessId) {
      throw new AppError('User is not associated with any business', 400);
    }

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business || business.deletedAt) {
      throw new AppError('Business not found', 404);
    }

    return await prisma.business.update({
      where: { id: businessId },
      data,
    });
  }

  public static async deleteBusiness(businessId: string | null) {
    if (!businessId) {
      throw new AppError('User is not associated with any business', 400);
    }

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business || business.deletedAt) {
      throw new AppError('Business not found or already deleted', 404);
    }

    // Soft delete business
    return await prisma.business.update({
      where: { id: businessId },
      data: { deletedAt: new Date() },
    });
  }
}
