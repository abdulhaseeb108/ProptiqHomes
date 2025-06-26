import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/listing/get?offer=true&limit=4`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/listing/get?type=rent&limit=4`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/listing/get?type=sale&limit=4`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-[#212922] font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-[#3E6259]'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-[#5B8266] text-xs sm:text-sm'>
Proptiq Homes is the best place to find your next perfect home.

          live.
          <br />
We offer a diverse selection of properties tailored to meet your lifestyle and budget.

        </div>
      <Link
  to={'/search'}
  className='text-xs sm:text-sm text-[#5B8266] font-bold hover:text-[#294936] hover:underline transition'
>
  Let's get started...
</Link>

      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-[#294936]'>
                Recent offers
              </h2>
              <Link
                className='text-sm text-[#AEF6C7] hover:underline'
                to={'/search?offer=true'}
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-[#294936]'>
                Recent places for rent
              </h2>
              <Link
  to={'/search?type=rent'}
  className='text-xs sm:text-sm text-[#5B8266] font-bold hover:text-[#294936] hover:underline transition'
>
  Show more places for rent
</Link>

            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-[#294936]'>
                Recent places for sale
              </h2>
              <Link
  to={'/search?type=sale'}
  className='text-xs sm:text-sm text-[#5B8266] font-bold hover:text-[#294936] hover:underline transition'
>
  Show more places for sale
</Link>

            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
