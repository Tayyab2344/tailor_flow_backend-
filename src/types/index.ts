import { UserRole } from '@prisma/client';

export interface UserPayload {
  userId: string;
  email: string;
  role: UserRole;
  businessId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
