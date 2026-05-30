"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const client_1 = require("@prisma/client");
class DashboardService {
    static async getStats(businessId) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Active order statuses (not finished, delivered or cancelled)
        const activeStatuses = [
            client_1.OrderStatus.PENDING,
            client_1.OrderStatus.MEASURING,
            client_1.OrderStatus.CUTTING,
            client_1.OrderStatus.STITCHING,
            client_1.OrderStatus.EMBROIDERY,
            client_1.OrderStatus.IRONING,
            client_1.OrderStatus.QUALITY_CHECK,
        ];
        const [totalCustomers, totalOrders, activeOrders, delayedOrders, completedOrders, activeEmployees, todayPayments, monthlyPayments,] = await db_1.default.$transaction([
            // 1. Total Customers
            db_1.default.customer.count({
                where: { businessId, deletedAt: null },
            }),
            // 2. Total Orders
            db_1.default.order.count({
                where: { businessId, deletedAt: null },
            }),
            // 3. Active Orders
            db_1.default.order.count({
                where: {
                    businessId,
                    status: { in: activeStatuses },
                    deletedAt: null,
                },
            }),
            // 4. Delayed Orders (active orders with delivery date in the past)
            db_1.default.order.count({
                where: {
                    businessId,
                    status: { in: activeStatuses },
                    deliveryDate: { lt: now },
                    deletedAt: null,
                },
            }),
            // 5. Completed Orders (Delivered)
            db_1.default.order.count({
                where: {
                    businessId,
                    status: client_1.OrderStatus.DELIVERED,
                    deletedAt: null,
                },
            }),
            // 6. Active Employees
            db_1.default.employee.count({
                where: {
                    businessId,
                    status: client_1.EmployeeStatus.ACTIVE,
                    deletedAt: null,
                },
            }),
            // 7. Today Revenue Payments
            db_1.default.payment.findMany({
                where: {
                    order: { businessId, deletedAt: null },
                    createdAt: { gte: startOfToday },
                    deletedAt: null,
                },
                select: { amount: true },
            }),
            // 8. Monthly Revenue Payments
            db_1.default.payment.findMany({
                where: {
                    order: { businessId, deletedAt: null },
                    createdAt: { gte: startOfMonth },
                    deletedAt: null,
                },
                select: { amount: true },
            }),
        ]);
        const todayRevenue = todayPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            totalCustomers,
            totalOrders,
            activeOrders,
            delayedOrders,
            todayRevenue,
            monthlyRevenue,
            completedOrders,
            activeEmployees,
        };
    }
    static async getRevenueAnalytics(businessId) {
        // Return last 6 months revenue stats
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        const payments = await db_1.default.payment.findMany({
            where: {
                order: { businessId, deletedAt: null },
                createdAt: { gte: sixMonthsAgo },
                deletedAt: null,
            },
            select: {
                amount: true,
                createdAt: true,
            },
        });
        // Group by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyMap = {};
        // Initialize map for the last 6 months
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
            monthlyMap[label] = 0;
        }
        payments.forEach((payment) => {
            const pDate = new Date(payment.createdAt);
            const label = `${months[pDate.getMonth()]} ${pDate.getFullYear()}`;
            if (label in monthlyMap) {
                monthlyMap[label] += Number(payment.amount);
            }
        });
        // Map to array ordered oldest to newest
        const chartData = Object.keys(monthlyMap)
            .map((key) => ({
            month: key,
            revenue: monthlyMap[key],
        }))
            .reverse();
        return chartData;
    }
    static async getOrdersAnalytics(businessId) {
        // 1. Get orders count by status
        const ordersByStatus = await db_1.default.order.groupBy({
            by: ['status'],
            where: { businessId, deletedAt: null },
            _count: { id: true },
        });
        // 2. Format chart friendly status data
        const statusData = Object.values(client_1.OrderStatus).map((status) => {
            const found = ordersByStatus.find((o) => o.status === status);
            return {
                status,
                count: found ? found._count.id : 0,
            };
        });
        // 3. Get monthly orders count for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        const monthlyOrders = await db_1.default.order.findMany({
            where: {
                businessId,
                createdAt: { gte: sixMonthsAgo },
                deletedAt: null,
            },
            select: {
                createdAt: true,
            },
        });
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyMap = {};
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
            monthlyMap[label] = 0;
        }
        monthlyOrders.forEach((order) => {
            const oDate = new Date(order.createdAt);
            const label = `${months[oDate.getMonth()]} ${oDate.getFullYear()}`;
            if (label in monthlyMap) {
                monthlyMap[label] += 1;
            }
        });
        const monthlyTrend = Object.keys(monthlyMap)
            .map((key) => ({
            month: key,
            count: monthlyMap[key],
        }))
            .reverse();
        return {
            byStatus: statusData,
            monthlyTrend,
        };
    }
    static async getEmployeesAnalytics(businessId) {
        // Completed orders count per tailor
        const tailors = await db_1.default.employee.findMany({
            where: {
                businessId,
                role: 'TAILOR',
                deletedAt: null,
            },
            include: {
                orders: {
                    where: {
                        status: client_1.OrderStatus.READY || client_1.OrderStatus.DELIVERED,
                        deletedAt: null,
                    },
                },
            },
        });
        return tailors.map((tailor) => ({
            employeeId: tailor.id,
            name: tailor.name,
            role: tailor.role,
            status: tailor.status,
            completedOrdersCount: tailor.orders.length,
        }));
    }
    static async getCustomersAnalytics(businessId) {
        // Get top spending customers
        const customers = await db_1.default.customer.findMany({
            where: { businessId, deletedAt: null },
            include: {
                orders: {
                    where: { deletedAt: null },
                    select: { price: true, quantity: true },
                },
            },
        });
        const customerSpendData = customers.map((c) => {
            const totalSpend = c.orders.reduce((sum, order) => sum + Number(order.price) * order.quantity, 0);
            return {
                customerId: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                totalOrders: c.orders.length,
                totalSpend,
            };
        });
        // Sort by spend descending and take top 10
        return customerSpendData.sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 10);
    }
}
exports.DashboardService = DashboardService;
