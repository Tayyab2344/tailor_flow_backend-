import prisma from '../../config/db';
import { AppError } from '../../utils/errors';
import { Prisma } from '@prisma/client';

export class PaymentService {
  private static async verifyOrderBelongsToBusiness(orderId: string, businessId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, businessId, deletedAt: null },
    });
    if (!order) {
      throw new AppError('Order not found or access denied', 404);
    }
    return order;
  }

  public static async createPayment(businessId: string, data: any) {
    const order = await this.verifyOrderBelongsToBusiness(data.orderId, businessId);
    const amount = new Prisma.Decimal(data.amount);

    return await prisma.$transaction(async (tx) => {
      // 1. Create Payment record
      const payment = await tx.payment.create({
        data: {
          orderId: data.orderId,
          amount,
          paymentMethod: data.paymentMethod,
          transactionReference: data.transactionReference,
          notes: data.notes,
        },
      });

      // 2. Adjust Order remainingAmount
      const updatedRemaining = order.remainingAmount.sub(amount);
      await tx.order.update({
        where: { id: data.orderId },
        data: {
          remainingAmount: updatedRemaining,
        },
      });

      return payment;
    });
  }

  public static async getPayments(businessId: string, orderId?: string) {
    const where: Prisma.PaymentWhereInput = {
      deletedAt: null,
      order: {
        businessId,
        deletedAt: null,
      },
    };

    if (orderId) {
      where.orderId = orderId;
    }

    return await prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public static async getPaymentById(businessId: string, id: string) {
    const payment = await prisma.payment.findFirst({
      where: {
        id,
        deletedAt: null,
        order: {
          businessId,
          deletedAt: null,
        },
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    return payment;
  }

  public static async updatePayment(businessId: string, id: string, data: any) {
    const payment = await prisma.payment.findFirst({
      where: {
        id,
        deletedAt: null,
        order: {
          businessId,
          deletedAt: null,
        },
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    const oldAmount = payment.amount;
    const newAmount = data.amount !== undefined ? new Prisma.Decimal(data.amount) : oldAmount;

    return await prisma.$transaction(async (tx) => {
      // 1. Update Payment record
      const updatedPayment = await tx.payment.update({
        where: { id },
        data: {
          amount: newAmount,
          paymentMethod: data.paymentMethod,
          transactionReference: data.transactionReference,
          notes: data.notes,
        },
      });

      // 2. Adjust Order remainingAmount
      // diff = oldAmount - newAmount
      // newRemaining = oldRemaining + diff
      const difference = oldAmount.sub(newAmount);
      const newRemaining = payment.order.remainingAmount.add(difference);

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          remainingAmount: newRemaining,
        },
      });

      return updatedPayment;
    });
  }

  public static async deletePayment(businessId: string, id: string) {
    const payment = await prisma.payment.findFirst({
      where: {
        id,
        deletedAt: null,
        order: {
          businessId,
          deletedAt: null,
        },
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Soft delete payment
      const deleted = await tx.payment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      // 2. Return payment amount back to order's remainingAmount
      const restoredRemaining = payment.order.remainingAmount.add(payment.amount);
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          remainingAmount: restoredRemaining,
        },
      });

      return deleted;
    });
  }
}
