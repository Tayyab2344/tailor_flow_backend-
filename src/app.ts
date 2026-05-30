import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../docs/swagger.json';

// Import Route modules
import authRouter from './modules/auth/auth.routes';
import businessRouter from './modules/businesses/business.routes';
import customerRouter from './modules/customers/customer.routes';
import measurementRouter from './modules/measurements/measurement.routes';
import employeeRouter from './modules/employees/employee.routes';
import orderRouter from './modules/orders/order.routes';
import paymentRouter from './modules/payments/payment.routes';
import dashboardRouter from './modules/dashboard/dashboard.routes';
import notificationRouter from './modules/notifications/notification.routes';
import settingsRouter from './modules/settings/settings.routes';
import uploadRouter from './modules/upload/upload.routes';

// Import Middlewares
import { errorHandler } from './middleware/error';
import { sendError } from './utils/response';

const app = express();

// 1. Core Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Swagger UI Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 4. API Modules Routing
app.use('/api/auth', authRouter);
app.use('/api/business', businessRouter);
app.use('/api/customers', customerRouter);
app.use('/api/measurements', measurementRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

// Root Route Redirecting or status check
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'TailorFlow backend is running healthy!' });
});

// 5. Catch-all Not Found Route
app.use((req, res) => {
  return sendError(res, `Route ${req.method} ${req.path} not found`, [], 404);
});

// 6. Global Error Handling Middleware
app.use(errorHandler);

export default app;
