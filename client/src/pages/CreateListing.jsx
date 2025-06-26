import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
        })
        .catch((err) => {
          console.error('Upload error:', err);
          setImageUploadError('Image upload failed');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: form,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
      return data.secure_url;
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError(false);

     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/listing/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ✅ allows sending cookies
  mode: 'cors',           // ✅ needed for cross-origin cookie
  body: JSON.stringify(formData), // ✅ don't send userRef manually
});


      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message || 'Failed to create listing');
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.error('Create listing error:', error);
      setError(error.message || 'An error occurred while creating the listing');
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className='flex gap-6 flex-wrap'>
            <label className='flex gap-2'>
              <input type='checkbox' id='sale' onChange={handleChange} checked={formData.type === 'sale'} />
              Sell
            </label>
            <label className='flex gap-2'>
              <input type='checkbox' id='rent' onChange={handleChange} checked={formData.type === 'rent'} />
              Rent
            </label>
            <label className='flex gap-2'>
              <input type='checkbox' id='parking' onChange={handleChange} checked={formData.parking} />
              Parking spot
            </label>
            <label className='flex gap-2'>
              <input type='checkbox' id='furnished' onChange={handleChange} checked={formData.furnished} />
              Furnished
            </label>
            <label className='flex gap-2'>
              <input type='checkbox' id='offer' onChange={handleChange} checked={formData.offer} />
              Offer
            </label>
          </div>

          <div className='flex flex-wrap gap-6'>
            <label className='flex items-center gap-2'>
              <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border rounded-lg' onChange={handleChange} value={formData.bedrooms} />
              Beds
            </label>
            <label className='flex items-center gap-2'>
              <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border rounded-lg' onChange={handleChange} value={formData.bathrooms} />
              Baths
            </label>
            <label className='flex items-center gap-2'>
              <input type='number' id='regularPrice' min='50' max='10000000' required className='p-3 border rounded-lg' onChange={handleChange} value={formData.regularPrice} />
              Regular price {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
            </label>
            {formData.offer && (
              <label className='flex items-center gap-2'>
                <input type='number' id='discountPrice' min='0' max='10000000' required className='p-3 border rounded-lg' onChange={handleChange} value={formData.discountPrice} />
                Discounted price {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
              </label>
            )}
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images: <span className='font-normal text-[#5B8266] ml-2'>The first image will be the cover (max 6)</span></p>
          <div className='flex gap-4'>
            <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-[#3E6259] rounded w-full' type='file' id='images' accept='image/*' multiple />
            <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-[#294936] border border-[#294936] rounded uppercase hover:shadow-lg disabled:opacity-80'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-3 border items-center'>
              <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
              <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
            </div>
          ))}
          <button disabled={loading || uploading} className='p-3 bg-[#212922] text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
