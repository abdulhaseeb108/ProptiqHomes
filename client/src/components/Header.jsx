import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get('searchTerm') || '';
    setSearchTerm(term);
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchTerm.trim()) params.set('searchTerm', searchTerm.trim());
    else params.delete('searchTerm');
    navigate(`/search?${params.toString()}`);
  };

  return (
    <header className='bg-[#3E6259] shadow-md sticky top-0 z-50'>
<div className='max-w-7xl mx-auto flex items-center justify-between px-8 py-4 sm:py-5'>
        {/* 🔹 Brand Name */}
        <Link to='/' className='flex items-center space-x-1'>
          <span className='text-xl sm:text-2xl font-bold tracking-tight text-[#AEF6C7]'>
            Proptiq
          </span>
          <span className='text-xl sm:text-2xl font-semibold text-[#212922]'>
            Homes
          </span>
        </Link>

        {/* 🔍 Search */}
        <form
          onSubmit={handleSubmit}
          className='flex items-center bg-white rounded-full shadow-sm px-3 py-1 w-48 sm:w-64 focus-within:ring-2 focus-within:ring-[#294936]'
        >
          <input
            type='text'
            placeholder='Search properties...'
            className='flex-grow bg-transparent text-[#212922] placeholder-[#5B8266] text-sm focus:outline-none'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-[#5B8266]' />
          </button>
        </form>

        {/* 🔗 Nav */}
        <nav>
          <ul className='flex items-center gap-6 text-[#212922] text-sm sm:text-base'>
            <li>
              <Link to='/' className='hover:text-[#AEF6C7] transition'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/about' className='hover:text-[#AEF6C7] transition'>
                About
              </Link>
            </li>
            <li>
              <Link to='/profile'>
                {currentUser ? (
                  <img
                    className='h-8 w-8 rounded-full object-cover border-2 border-[#294936]'
                    src={currentUser.avatar}
                    alt='Profile'
                  />
                ) : (
                  <span className='hover:text-[#AEF6C7] transition'>
                    Sign In
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
