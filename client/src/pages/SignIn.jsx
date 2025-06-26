import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    dispatch(signInStart());

    try {
      console.log('🔐 Sending login request with:', formData);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signin`,
        formData,
        { withCredentials: true }
      );

      console.log('✅ Login response:', res.data);
      dispatch(signInSuccess(res.data));
      navigate('/');
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Signin failed';
      setError(errorMessage);
      dispatch(signInFailure(error.response?.data));
    }
  };

  return (
    <div className='pt-20 min-h-screen flex items-center justify-center bg-[#AEF6C7]'>
      <div className='p-6 w-full max-w-md bg-white rounded-lg shadow-md'>
        <h1 className='text-3xl text-center font-semibold mb-6 text-[#212922]'>Sign In</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            className='border border-[#3E6259] p-3 bg-white text-[#212922] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E6259]'
            id='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='border border-[#3E6259] p-3 bg-white text-[#212922] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E6259]'
            id='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type='submit'
            className='bg-[#3E6259] text-white p-3 rounded-lg uppercase hover:bg-[#294936] transition disabled:opacity-80'
            disabled={!formData.email || !formData.password}
          >
            Sign In
          </button>
          <OAuth />
          {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
        </form>
        <div className='flex gap-2 mt-5 justify-center text-[#212922]'>
          <p>Don't have an account?</p>
          <Link to='/sign-up'>
            <span className='text-[#3E6259] font-medium hover:underline'>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
