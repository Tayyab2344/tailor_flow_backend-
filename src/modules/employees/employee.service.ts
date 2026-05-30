import bcrypt from 'bcrypt';
import prisma from '../../config/db';
import { AppError } from '../../utils/errors';

export class EmployeeService {
  public static async createEmployee(businessId: string, data: any) {
    const { name, phone, role, status, joinDate, profileImage, email, password } = data;

    return await prisma.$transaction(async (tx) => {
      let userId: string | undefined;

      // 1. If credentials provided, create User record first
      if (email && password) {
        const existingUser = await tx.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new AppError('An account with this email already exists', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role,
            businessId,
            profileImage,
          },
        });
        userId = user.id;
      }

      // 2. Create Employee record
      const employee = await tx.employee.create({
        data: {
          businessId,
          userId,
          name,
          phone,
          role,
          status,
          joinDate: joinDate ? new Date(joinDate) : new Date(),
          profileImage,
        },
        include: {
          user: {
            select: {
              email: true,
              id: true
            }
          }
        }
      });

      return employee;
    });
  }

  public static async getEmployees(businessId: string) {
    return await prisma.employee.findMany({
      where: {
        businessId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            email: true,
            id: true,
          },
        },
      },
      orderBy: {
        joinDate: 'desc',
      },
    });
  }

  public static async getEmployeeById(businessId: string, id: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        id,
        businessId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    });

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    return employee;
  }

  public static async updateEmployee(businessId: string, id: string, data: any) {
    const employee = await prisma.employee.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Update Employee details
      const updated = await tx.employee.update({
        where: { id },
        data: {
          name: data.name,
          phone: data.phone,
          role: data.role,
          status: data.status,
          joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
          profileImage: data.profileImage,
        },
      });

      // 2. If employee has a linked user, update User's name/role as well
      if (updated.userId) {
        await tx.user.update({
          where: { id: updated.userId },
          data: {
            name: data.name,
            role: data.role,
            profileImage: data.profileImage,
          },
        });
      }

      return updated;
    });
  }

  public static async deleteEmployee(businessId: string, id: string) {
    const employee = await prisma.employee.findFirst({
      where: { id, businessId, deletedAt: null },
    });

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    return await prisma.$transaction(async (tx) => {
      // If linked user exists, soft delete user account too
      if (employee.userId) {
        await tx.user.update({
          where: { id: employee.userId },
          data: { deletedAt: new Date() },
        });
      }

      // Soft delete employee record
      return await tx.employee.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }
}
