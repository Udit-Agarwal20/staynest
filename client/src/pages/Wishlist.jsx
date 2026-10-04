import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import ListingCard from '../components/ListingCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api
      .get('/users/wishlist')
      .then(({ data }) => setWishlist(data))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = (listingId, isWishlisted) => {
    if (!isWishlisted) {
      setWishlist((prev) => (prev ? prev.filter((item) => item._id !== listingId) : []));
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!wishlist) return <Loader />;

  return (
    <section>
      <h1>My Wishlist</h1>
      <p className="muted">Your saved stays for upcoming travels.</p>

      {wishlist.length === 0 ? (
        <div className="empty">
          <p className="muted">Your wishlist is currently empty.</p>
          <Link to="/" className="btn" style={{ marginTop: '12px', display: 'inline-block' }}>
            Explore Stays
          </Link>
        </div>
      ) : (
        <div className="grid" style={{ marginTop: '24px' }}>
          {wishlist.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onWishlistToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}
