import prisma from '../../config/db';
import { AppError } from '../../utils/errors';

export class NotificationService {
  public static async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  public static async markAsRead(userId: string, id: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
