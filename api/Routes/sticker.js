import { Router } from 'express';
import stickerController from '../Controllers/sticker';

const router = Router();

router.get('', stickerController.get);
router.post('/', stickerController.add);
router.put('/:id', stickerController.update);
router.delete('/:id', stickerController.delete);

export default router;
