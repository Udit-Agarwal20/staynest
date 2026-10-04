import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/users/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    populate: { path: 'host', select: 'name' },
  });
  const activeWishlist = (user.wishlist || []).filter(Boolean);
  res.json(activeWishlist);
});

// POST /api/users/wishlist/:listingId
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const user = await User.findById(req.user._id);

  const index = user.wishlist.findIndex((id) => id.toString() === listingId);
  let isWishlisted = false;

  if (index > -1) {
    user.wishlist.splice(index, 1);
    isWishlisted = false;
  } else {
    user.wishlist.push(listingId);
    isWishlisted = true;
  }

  await user.save();
  res.json({ wishlist: user.wishlist, isWishlisted });
});
