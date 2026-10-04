import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client.js';
import { STAY_TYPES } from '../../utils/format.js';

const empty = {
  title: '',
  description: '',
  type: 'homestay',
  city: '',
  state: '',
  address: '',
  pricePerNight: '',
  maxGuests: 2,
  bedrooms: 1,
  amenities: '',
  imageUrl: '',
};

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/listings/${id}`).then(({ data }) =>
      setForm({
        ...empty,
        ...data,
        amenities: data.amenities.join(', '),
        imageUrl: data.images[0] || '',
      })
    );
  }, [id, isEdit]);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const markTouched = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const errors = {};
  if (form.title && (form.title.trim().length < 10 || form.title.trim().length > 100)) {
    errors.title = 'Title must be between 10 and 100 characters';
  } else if (!form.title && touched.title) {
    errors.title = 'Title is required';
  }

  if (form.description && form.description.trim().length < 30) {
    errors.description = 'Description must be at least 30 characters';
  } else if (!form.description && touched.description) {
    errors.description = 'Description is required';
  }

  if (form.pricePerNight !== '' && Number(form.pricePerNight) <= 0) {
    errors.pricePerNight = 'Price must be greater than 0';
  } else if (form.pricePerNight === '' && touched.pricePerNight) {
    errors.pricePerNight = 'Price is required';
  }

  if (form.imageUrl && form.imageUrl.trim() !== '') {
    try {
      const parsed = new URL(form.imageUrl.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        errors.imageUrl = 'Image URL must start with http:// or https://';
      }
    } catch {
      errors.imageUrl = 'Please enter a valid URL';
    }
  }

  const hasErrors =
    form.title.trim().length < 10 ||
    form.title.trim().length > 100 ||
    form.description.trim().length < 30 ||
    !form.pricePerNight ||
    Number(form.pricePerNight) <= 0 ||
    Boolean(errors.imageUrl);

  // TODO: replace the image URL field with real image upload (Cloudinary / multer).
  const submit = async (e) => {
    e.preventDefault();
    if (hasErrors) return;
    setError('');
    const { title, description, type, city, state, address, imageUrl, amenities } = form;
    const payload = {
      title,
      description,
      type,
      city,
      state,
      address,
      pricePerNight: Number(form.pricePerNight),
      maxGuests: Number(form.maxGuests),
      bedrooms: Number(form.bedrooms),
      amenities: amenities.split(',').map((a) => a.trim()).filter(Boolean),
    };
    if (imageUrl) payload.images = [imageUrl];
    try {
      if (isEdit) await api.put(`/listings/${id}`, payload);
      else await api.post('/listings', payload);
      navigate('/host');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form className="card form wide" onSubmit={submit}>
      <h1>{isEdit ? 'Edit listing' : 'Create a new listing'}</h1>
      <label>
        Title
        <input
          required
          placeholder="Title (10-100 characters)"
          value={form.title}
          onChange={set('title')}
          onBlur={markTouched('title')}
        />
        {errors.title && <span className="error small">{errors.title}</span>}
      </label>
      <label>
        Description
        <textarea
          required
          placeholder="Describe your place (at least 30 characters)"
          value={form.description}
          onChange={set('description')}
          onBlur={markTouched('description')}
        />
        {errors.description && <span className="error small">{errors.description}</span>}
      </label>
      <div className="row">
        <label className="grow">
          Type
          <select value={form.type} onChange={set('type')}>
            {STAY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="grow">
          Price per night (₹)
          <input
            required
            type="number"
            min="1"
            placeholder="Price per night (₹)"
            value={form.pricePerNight}
            onChange={set('pricePerNight')}
            onBlur={markTouched('pricePerNight')}
          />
          {errors.pricePerNight && <span className="error small">{errors.pricePerNight}</span>}
        </label>
      </div>
      <div className="row">
        <input required placeholder="City" value={form.city} onChange={set('city')} />
        <input required placeholder="State" value={form.state} onChange={set('state')} />
      </div>
      <input required placeholder="Address" value={form.address} onChange={set('address')} />
      <div className="row">
        <label className="grow">Max guests
          <input type="number" min="1" value={form.maxGuests} onChange={set('maxGuests')} />
        </label>
        <label className="grow">Bedrooms
          <input type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} />
        </label>
      </div>
      <input placeholder="Amenities (comma separated: WiFi, AC, Parking)" value={form.amenities} onChange={set('amenities')} />
      <label>
        Image URL (optional)
        <input
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={set('imageUrl')}
          onBlur={markTouched('imageUrl')}
        />
        {errors.imageUrl && <span className="error small">{errors.imageUrl}</span>}
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={hasErrors}>{isEdit ? 'Save changes' : 'Publish listing'}</button>
    </form>
  );
}
