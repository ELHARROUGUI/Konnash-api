import { Router } from 'express';
import tagController from '../Controllers/tag';

const router = Router();

router.get('', tagController.get);
router.post('/', tagController.add);
router.put('/:id', tagController.update);
router.delete('/:id', tagController.delete);

export default router;
