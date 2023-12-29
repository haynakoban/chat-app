import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// config
import { auth } from '../config/firebaseConfig';

// hooks
import useCookies from '../hooks/useCookies';

// store
import useUsersStore from '../store/useUsersStore';

// components
import AuthContainer from '../components/auth/AuthContainer';
import SignInWithGoogle from '../components/auth/SignInWithGoogle';

// helpers
import {
  handleEmailValidation,
  handlePasswordValidation,
} from '../helpers/validation';

const Register = () => {
  const { setCookie, getCookie } = useCookies();
  const { createUser } = useUsersStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // password state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const authToken = getCookie('auth-token');

    if (authToken) {
      navigate(-1);
    }
  }, [getCookie, navigate]);

  const handleFormSubmit = async (data) => {
    const { email, fullName, password } = data;

    if (isValid) {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        createUser({ password, fullName, user: result?.user });

        setCookie('auth-token', result?.user?.refreshToken);
        navigate('/');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AuthContainer>
      <h1 className='text-xl sm:text-3xl font-medium pb-0 sm:pb-1'>Register</h1>
      <p className='text-sm sm:text-md font-normal pb-0 sm:pb-1'>
        Stay close, stay connected. Join now!
      </p>

      {/* full name field */}
      <div className='my-3 sm:my-6'>
        <input
          type='text'
          className={`${
            errors.fullName?.message ? 'border-red-600' : 'border-gray-400'
          }
          bg-[#F2F2F2] border  text-gray-900 text-sm sm:text-md rounded-md block w-full p-3 sm:p-3.5 focus:outline-none`}
          placeholder='Full name'
          value={watch('fullName')}
          {...register('fullName', {
            required: 'Full name field is required',
            minLength: {
              value: 4,
              message: `Full name must at least 4 characters`,
            },
          })}
        />
        {errors.fullName?.message && (
          <span className='text-xs p-1 text-red-600'>
            {errors.fullName?.message}
          </span>
        )}
      </div>

      {/* email field */}
      <div className='my-3 sm:my-6'>
        <input
          type='email'
          className={`${
            errors.email?.message ? 'border-red-600' : 'border-gray-400'
          }
          bg-[#F2F2F2] border  text-gray-900 text-sm sm:text-md rounded-md block w-full p-3 sm:p-3.5 focus:outline-none`}
          placeholder='Email'
          value={watch('email')}
          {...register('email', {
            required: 'Email field is required',
            validate: (email) =>
              handleEmailValidation(email) === true || 'Invalid email address',
          })}
        />
        {errors.email?.message && (
          <span className='text-xs p-1 text-red-600'>
            {errors.email?.message}
          </span>
        )}
      </div>

      {/* password field */}
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`${
            errors.password?.message ? 'border-red-600' : 'border-gray-400'
          } bg-[#F2F2F2] border text-gray-900 text-sm sm:text-md rounded-md block w-full p-3 sm:p-3.5 focus:outline-none`}
          placeholder='Password'
          value={watch('password')}
          {...register('password', {
            required: 'Password field is required',
            minLength: {
              value: 8,
              message: `password must at least 8 characters`,
            },
            maxLength: {
              value: 20,
              message: `password must not exceed 20 characters`,
            },
            validate: (password) => {
              const errors = handlePasswordValidation(password);

              if (errors.length > 0) {
                return errors.join('\n');
              }

              return true;
            },
          })}
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
      {errors.password?.message && (
        <div className='text-xs text-red-600'>
          {errors.password?.message.split('\n').map((error, index) => (
            <p key={index} className='p-1'>
              {error}
            </p>
          ))}
        </div>
      )}

      {/* confirm password field */}
      <div className='relative mt-3 sm:mt-6'>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          className={`${
            errors.confirmPassword?.message
              ? 'border-red-600'
              : 'border-gray-400'
          } bg-[#F2F2F2] border text-gray-900 text-sm sm:text-md rounded-md block w-full p-3 sm:p-3.5 focus:outline-none`}
          placeholder='Confirm Password'
          value={watch('confirmPassword')}
          {...register('confirmPassword', {
            required: 'Confirm password field is required',
            minLength: {
              value: 8,
              message: `password must at least 8 characters`,
            },
            maxLength: {
              value: 20,
              message: `password must not exceed 20 characters`,
            },
            validate: (confirmPassword) => {
              if (watch('password') !== confirmPassword) {
                return 'The password does not match';
              }

              return true;
            },
          })}
        />

        <div className='absolute top-[50%] right-0 translate-y-[-50%]'>
          <button
            type='button'
            className='text-blue-600 focus:outline-none font-medium text-xs sm:text-sm px-5 py-2.5 text-center'
            onClick={() => setShowConfirmPassword((show) => !show)}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {errors.confirmPassword?.message && (
        <span className='text-xs p-1 text-red-600'>
          {errors.confirmPassword?.message}
        </span>
      )}

      <button
        style={{ fontFamily: 'Poppins' }}
        className='mt-3 sm:mt-6 block w-full p-3 rounded-full text-sm sm:text-md tracking-wider font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none text-center'
        type='submit'
        onClick={handleSubmit(handleFormSubmit)}
      >
        Register
      </button>

      <div className='flex justify-center items-center mt-1.5 sm:mt-3'>
        <hr className='w-full h-px bg-[#20212837] border-0 mx-3' />
        <span className='text-gray-500' style={{ fontFamily: 'Poppins' }}>
          or
        </span>
        <hr className='w-full h-px bg-[#20212837] border-0 mx-3' />
      </div>

      {/* sign in with google */}
      <SignInWithGoogle />

      <div className='inline-flex items-center w-full mt-3 sm:mt-4'>
        <p className='tracking-wide text-sm sm:text-md'>
          Already have an account?
        </p>
        <button
          className='text-blue-600 focus:outline-none font-medium text-center pl-1 block text-sm sm:text-md'
          onClick={() => navigate('/login')}
        >
          Sign In
        </button>
      </div>
    </AuthContainer>
  );
};
export default Register;
