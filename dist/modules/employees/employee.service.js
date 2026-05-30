"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
class EmployeeService {
    static async createEmployee(businessId, data) {
        const { name, phone, role, status, joinDate, profileImage, email, password } = data;
        return await db_1.default.$transaction(async (tx) => {
            let userId;
            // 1. If credentials provided, create User record first
            if (email && password) {
                const existingUser = await tx.user.findUnique({ where: { email } });
                if (existingUser) {
                    throw new errors_1.AppError('An account with this email already exists', 409);
                }
                const hashedPassword = await bcrypt_1.default.hash(password, 10);
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
    static async getEmployees(businessId) {
        return await db_1.default.employee.findMany({
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
    static async getEmployeeById(businessId, id) {
        const employee = await db_1.default.employee.findFirst({
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
            throw new errors_1.AppError('Employee not found', 404);
        }
        return employee;
    }
    static async updateEmployee(businessId, id, data) {
        const employee = await db_1.default.employee.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!employee) {
            throw new errors_1.AppError('Employee not found', 404);
        }
        return await db_1.default.$transaction(async (tx) => {
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
    static async deleteEmployee(businessId, id) {
        const employee = await db_1.default.employee.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!employee) {
            throw new errors_1.AppError('Employee not found', 404);
        }
        return await db_1.default.$transaction(async (tx) => {
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
exports.EmployeeService = EmployeeService;
