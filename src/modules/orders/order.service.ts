import prisma from '../../config/db';
import { AppError } from '../../utils/errors';
import { OrderStatus, Prisma } from '@prisma/client';

export class OrderService {
  private static async verifyAccess(businessId: string, customerId: string, tailorId?: string | null) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, businessId, deletedAt: null },
    });
    if (!customer) {
      throw new AppError('Customer not found or access denied', 404);
    }

    if (tailorId) {
      const tailor = await prisma.employee.findFirst({
        where: { id: tailorId, businessId, deletedAt: null },
      });
      if (!tailor) {
        throw new AppError('Assigned tailor not found in this business', 404);
      }
    }
  }

  public static async createOrder(businessId: string, userId: string, data: any) {
    await this.verifyAccess(businessId, data.customerId, data.assignedTailorId);

    const price = new Prisma.Decimal(data.price);
    const quantity = data.quantity || 1;
    const advanceAmount = new Prisma.Decimal(data.advanceAmount || 0);
    const totalPrice = price.mul(quantity);
    const remainingAmount = totalPrice.sub(advanceAmount);

    return await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          businessId,
          customerId: data.customerId,
          measurementId: data.measurementId,
          assignedTailorId: data.assignedTailorId,
          dressType: data.dressType,
          fabricDetails: data.fabricDetails,
          quantity,
          price,
          advanceAmount,
          remainingAmount,
          status: OrderStatus.PENDING,
          deliveryDate: new Date(data.deliveryDate),
          notes: data.notes,
        },
      });

      // 2. Create timeline record
      await tx.orderTimeline.create({
        data: {
          orderId: order.id,
          previousStatus: null,
          newStatus: OrderStatus.PENDING,
          updatedBy: userId,
        },
      });

      // 3. Create payment record if advance amount > 0
      if (advanceAmount.greaterThan(0)) {
        await tx.payment.create({
          data: {
            orderId: order.id,
            amount: advanceAmount,
            paymentMethod: 'CASH', // default
            notes: 'Advance payment recorded at order creation',
          },
        });
      }

      return order;
    });
  }

  public static async getOrders(businessId: string, query: any) {
    const { page, limit, status, customerId, assignedTailorId, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      businessId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }
    if (customerId) {
      where.customerId = customerId;
    }
    if (assignedTailorId) {
      where.assignedTailorId = assignedTailorId;
    }
    if (search) {
      where.OR = [
        { dressType: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, orders] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          assignedTailor: true,
        },
        orderBy: {
          deliveryDate: 'asc',
        },
      }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async getOrderById(businessId: string, id: string) {
    const order = await prisma.order.findFirst({
      where: { id, businessId, deletedAt: null },
      include: {
        customer: true,
        measurement: true,
        assignedTailor: true,
        payments: { where: { deletedAt: null } },
        timelines: {
          include: {
            updatedByUser: {
              select: { name: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  public static async updateOrder(businessId: string, id: string, data: any) {
    const order = await prisma.order.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Verify relations if being changed
    const customerId = data.customerId || order.customerId;
    const tailorId = data.assignedTailorId !== undefined ? data.assignedTailorId : order.assignedTailorId;
    await this.verifyAccess(businessId, customerId, tailorId);

    // Calculate amounts
    const price = data.price !== undefined ? new Prisma.Decimal(data.price) : order.price;
    const quantity = data.quantity !== undefined ? data.quantity : order.quantity;
    const advanceAmount = data.advanceAmount !== undefined ? new Prisma.Decimal(data.advanceAmount) : order.advanceAmount;
    const totalPrice = price.mul(quantity);
    const remainingAmount = totalPrice.sub(advanceAmount);

    return await prisma.order.update({
      where: { id },
      data: {
        customerId: data.customerId,
        measurementId: data.measurementId,
        assignedTailorId: data.assignedTailorId,
        dressType: data.dressType,
        fabricDetails: data.fabricDetails,
        quantity,
        price,
        advanceAmount,
        remainingAmount,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        notes: data.notes,
      },
    });
  }

  public static async deleteOrder(businessId: string, id: string) {
    const order = await prisma.order.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return await prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public static async updateOrderStatus(businessId: string, userId: string, id: string, newStatus: OrderStatus) {
    const order = await prisma.order.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status === newStatus) {
      return order; // No change
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Update status
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: newStatus },
      });

      // 2. Append timeline entry
      await tx.orderTimeline.create({
        data: {
          orderId: id,
          previousStatus: order.status,
          newStatus,
          updatedBy: userId,
        },
      });

      return updatedOrder;
    });
  }

  public static async assignTailor(businessId: string, id: string, assignedTailorId: string | null) {
    const order = await prisma.order.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (assignedTailorId) {
      const tailor = await prisma.employee.findFirst({
        where: { id: assignedTailorId, businessId, deletedAt: null },
      });
      if (!tailor) {
        throw new AppError('Employee not found or access denied', 404);
      }
    }

    return await prisma.order.update({
      where: { id },
      data: { assignedTailorId },
    });
  }
}
