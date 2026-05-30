import prisma from '../../config/db';

export class SettingsService {
  public static async getSettings(businessId: string) {
    let settings = await prisma.settings.findUnique({
      where: { businessId },
    });

    if (!settings) {
      // Lazy initialize default settings if missing
      settings = await prisma.settings.create({
        data: {
          businessId,
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
          currency: 'USD',
          language: 'en',
          theme: 'dark',
          notificationSettings: { sms: true, email: true, whatsapp: false },
          businessPreferences: { enableInvoicePdf: true, defaultTaxRate: 0.05 }
        },
      });
    }

    return settings;
  }

  public static async updateSettings(businessId: string, data: any) {
    const settings = await prisma.settings.findUnique({
      where: { businessId },
    });

    if (!settings) {
      // If missing, create instead of update
      return await prisma.settings.create({
        data: {
          ...data,
          businessId,
        },
      });
    }

    return await prisma.settings.update({
      where: { businessId },
      data,
    });
  }
}
