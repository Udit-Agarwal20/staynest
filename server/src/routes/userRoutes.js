import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:listingId', toggleWishlist);

export default router;
