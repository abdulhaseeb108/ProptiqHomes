import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-[#fefae0] shadow-md hover:shadow-lg transition rounded-lg w-full sm:w-[330px] overflow-hidden">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            'https://via.placeholder.com/400x300?text=No+Image'
          }
          alt={listing.imageUrls[0] ? `${listing.name || 'Listing'} cover` : 'No image available'}
          className="h-[220px] w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="p-4 flex flex-col gap-2">
          <p className="text-lg font-semibold text-[#212922] truncate">
            {listing.name || 'Unnamed Listing'}
          </p>

          <div className="flex items-center gap-1 text-sm text-[#5B8266]">
            <MdLocationOn className="text-[#5B8266]" />
            <p className="truncate text-[#212922]">{listing.address || 'No address'}</p>
          </div>

          <p className="text-sm text-[#3E6259] line-clamp-2">
            {listing.description || 'No description available'}
          </p>

          <p className="text-[#212922] font-semibold mt-1">
            $
            {listing.offer && listing.discountPrice
              ? listing.discountPrice.toLocaleString()
              : listing.regularPrice?.toLocaleString() || '0'}
            {listing.type === 'rent' && ' / month'}
          </p>

          <div className="flex justify-between text-xs text-[#212922] font-medium mt-2">
            <span>{listing.bedrooms || 0} Bed{listing.bedrooms > 1 && 's'}</span>
            <span>{listing.bathrooms || 0} Bath{listing.bathrooms > 1 && 's'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
