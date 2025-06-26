import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError(null);
      console.log('📨 Sending signup request:', formData);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        formData,
        { withCredentials: true }
      );

      console.log('✅ Signup successful:', res.data);
      navigate('/sign-in');
    } catch (error) {
      console.error('❌ Signup error:', error.response?.data || error.message);
      setError(
        error.response?.data?.message || 'Signup failed. Try again later.'
      );
    }
  };

  return (
    <div className='pt-20 min-h-screen flex items-center justify-center bg-[#AEF6C7]'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'
      >
        <h1 className='text-3xl font-bold text-center text-[#212922] mb-6'>
          Sign Up
        </h1>

        <input
          type='text'
          id='username'
          placeholder='Username'
          value={formData.username}
          onChange={handleChange}
          className='w-full mb-4 p-3 border border-[#3E6259] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E6259] text-[#212922]'
        />
        <input
          type='email'
          id='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          className='w-full mb-4 p-3 border border-[#3E6259] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E6259] text-[#212922]'
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          className='w-full mb-6 p-3 border border-[#3E6259] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E6259] text-[#212922]'
        />

        <button
          type='submit'
          className='w-full bg-[#3E6259] text-white py-3 rounded-lg uppercase font-medium hover:bg-[#294936] transition'
        >
          Sign Up
        </button>

        <div className='my-4 text-center text-[#212922] text-sm'>OR</div>

        <OAuth />

        {error && (
          <p className='text-red-500 text-center mt-4 text-sm'>{error}</p>
        )}

        <p className='text-center text-sm mt-6 text-[#212922]'>
          Already have an account?{' '}
          <Link
            to='/sign-in'
            className='text-[#3E6259] font-medium hover:underline'
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
