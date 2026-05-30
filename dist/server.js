"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environmental config before anything else
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    logger_1.default.info(`⚡️[server]: TailorFlow Server is running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`);
    logger_1.default.info(`📖[swagger]: Documentation available at http://localhost:${PORT}/api-docs`);
});
// Handle uncaught exceptions and unhandled rejections cleanly
process.on('unhandledRejection', (err) => {
    logger_1.default.error(`Unhandled Promise Rejection: ${err.message}`, { stack: err.stack });
    server.close(() => process.exit(1));
});
process.on('uncaughtException', (err) => {
    logger_1.default.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    server.close(() => process.exit(1));
});
