import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';

// config
import { auth } from '../config/firebaseConfig';

// hooks
import useCookies from '../hooks/useCookies';

// components
import AuthContainer from '../components/auth/AuthContainer';
import SignInWithGoogle from '../components/auth/SignInWithGoogle';

const Login = () => {
  const { setCookie, getCookie } = useCookies();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // password state
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const authToken = getCookie('auth-token');

    if (authToken) {
      navigate(-1);
    }
  }, [getCookie, navigate]);

  const handleFormSubmit = async (data) => {
    const { email, password } = data;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      setCookie('auth-token', result?.user?.refreshToken);
      navigate('/');
    } catch (e) {
      setError('email', {
        type: 'value',
        message: 'Invalid Email and Password Combination',
      });
    }
  };

  return (
    <AuthContainer>
      <h1 className='text-xl sm:text-3xl font-medium pb-0 sm:pb-1'>Sign In</h1>
      <p className='text-sm sm:text-md font-normal pb-0 sm:pb-1'>
        Stay close, stay connected. Join now!
      </p>

      <div className='my-3 sm:my-6'>
        <input
          type='email'
          className={`${
            errors.email?.message ? 'border-red-600' : 'border-gray-400'
          }
          bg-[#F2F2F2] border  text-gray-900 text-sm sm:text-md rounded-md block w-full p-3 sm:p-3.5 focus:outline-none`}
          placeholder='Email'
          value={watch('email')}
          {...register('email')}
        />
      </div>

      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`${
            errors.email?.message ? 'border-red-600' : 'border-gray-400'
          }
          bg-[#F2F2F2] border  text-gray-900 text-sm sm:text-md rounded-md block w-full p-3 sm:p-3.5 focus:outline-none`}
          placeholder='Password'
          value={watch('password')}
          {...register('password')}
        />
        <div className='absolute top-[50%] right-0 translate-y-[-50%]'>
          <button
            type='button'
            className='text-blue-600 focus:outline-none font-medium text-xs sm:text-sm px-5 py-2.5 text-center'
            onClick={() => setShowPassword((show) => !show)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {errors.email?.message && (
        <span className='text-xs p-1 text-red-600'>
          {errors.email?.message}
        </span>
      )}

      <button
        className='text-blue-600 focus:outline-none font-medium text-xs sm:text-sm text-center pl-0.5 block mb-3 sm:mb-6 mt-2 sm:mt-3'
        onClick={() => console.log('forgot password')}
      >
        Forgot password?
      </button>

      <button
        style={{ fontFamily: 'Poppins' }}
        className='block w-full p-3 rounded-full text-sm sm:text-md tracking-wider font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none text-center'
        onClick={handleSubmit(handleFormSubmit)}
      >
        Sign In
      </button>

      <div className='flex justify-center items-center mt-1.5 sm:mt-3'>
        <hr className='w-full h-px bg-[#20212837] border-0 mx-3' />
        <span className='text-gray-500' style={{ fontFamily: 'Poppins' }}>
          or
        </span>
        <hr className='w-full h-px bg-[#20212837] border-0 mx-3' />
      </div>

      <SignInWithGoogle />

      <div className='inline-flex items-center w-full mt-4'>
        <p className='tracking-wide text-sm sm:text-md'>
          Don't have an account?
        </p>
        <button
          className='text-blue-600 focus:outline-none font-medium text-center pl-1 block text-sm sm:text-md'
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
      </div>
    </AuthContainer>
  );
};
export default Login;
