import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import { formatINR } from '../utils/format.js';

export default function ListingCard({ listing, onWishlistToggle }) {
  const { user, updateWishlist } = useAuth();
  const navigate = useNavigate();

  const isWishlisted = Boolean(
    user?.wishlist?.some((id) => (typeof id === 'string' ? id : id?._id) === listing._id)
  );

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await api.post(`/users/wishlist/${listing._id}`);
      updateWishlist(data.wishlist);
      if (onWishlistToggle) {
        onWishlistToggle(listing._id, data.isWishlisted);
      }
    } catch (err) {
      console.error('Failed to update wishlist', err);
    }
  };

  return (
    <div className="card listing-card-wrapper">
      <Link to={`/stays/${listing._id}`} className="listing-card">
        <div className="card-media">
          <img src={listing.images[0]} alt={listing.title} />
          <button
            type="button"
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            ♥
          </button>
        </div>
        <div className="card-body">
          <div className="row-between">
            <span className="tag">{listing.type}</span>
            <span className="muted">
              {listing.reviewCount > 0 ? `★ ${listing.avgRating} (${listing.reviewCount})` : 'New'}
            </span>
          </div>
          <strong className="listing-title">{listing.title}</strong>
          <span className="muted">{listing.city}, {listing.state}</span>
          <span>
            <strong>{formatINR(listing.pricePerNight)}</strong> <span className="muted">/ night</span>
          </span>
        </div>
      </Link>
    </div>
  );
}
