"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("../docs/swagger.json"));
// Import Route modules
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const business_routes_1 = __importDefault(require("./modules/businesses/business.routes"));
const customer_routes_1 = __importDefault(require("./modules/customers/customer.routes"));
const measurement_routes_1 = __importDefault(require("./modules/measurements/measurement.routes"));
const employee_routes_1 = __importDefault(require("./modules/employees/employee.routes"));
const order_routes_1 = __importDefault(require("./modules/orders/order.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const notification_routes_1 = __importDefault(require("./modules/notifications/notification.routes"));
const settings_routes_1 = __importDefault(require("./modules/settings/settings.routes"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
// Import Middlewares
const error_1 = require("./middleware/error");
const response_1 = require("./utils/response");
const app = (0, express_1.default)();
// 1. Core Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
// 2. Request Parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 3. Swagger UI Docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// 4. API Modules Routing
app.use('/api/auth', auth_routes_1.default);
app.use('/api/business', business_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/measurements', measurement_routes_1.default);
app.use('/api/employees', employee_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
// Root Route Redirecting or status check
app.get('/', (_req, res) => {
    res.status(200).json({ success: true, message: 'Welcome to the TailorFlow API backend!' });
});
app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'TailorFlow backend is running healthy!' });
});
// 5. Catch-all Not Found Route
app.use((req, res) => {
    return (0, response_1.sendError)(res, `Route ${req.method} ${req.path} not found`, [], 404);
});
// 6. Global Error Handling Middleware
app.use(error_1.errorHandler);
exports.default = app;
