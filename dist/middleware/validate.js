"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Re-assign parsed inputs to validate/sanitize values
            req.body = parsed.body;
            req.query = parsed.query;
            req.params = parsed.params;
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.validate = validate;
