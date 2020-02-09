import { Router } from 'express';
import noteController from '../Controllers/note';

const router = Router();

router.get('', noteController.get);
router.post('/', noteController.add);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

export default router;
