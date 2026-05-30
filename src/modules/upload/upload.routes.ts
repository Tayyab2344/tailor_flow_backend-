import { Router } from 'express';
import { UploadController } from './upload.controller';
import { upload } from '../../middleware/upload';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.post('/', upload.single('file'), UploadController.uploadFile);

export default router;
