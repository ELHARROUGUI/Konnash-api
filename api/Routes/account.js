import { Router } from 'express';
import accountController from '../Controllers/account';

const router = Router();

router.get('', accountController.get);
router.post('/', accountController.add);
router.put('/:id', accountController.update);
router.delete('/:id', accountController.delete);

export default router;
