import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

// config
import { auth, db, google } from '../../config/firebaseConfig';

// store
import useUsersStore from '../../store/useUsersStore';

// hooks
import useCookies from '../../hooks/useCookies';

const SignInWithGoogle = () => {
  const { setCookie } = useCookies();
  const { createUser } = useUsersStore();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, google);

      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', result.user.uid)
      );

      const userDocs = await getDocs(userQuery);

      // If there are no matching documents, proceed to create a new user account
      if (userDocs.empty) {
        createUser({ fullName: result?.user?.displayName, user: result?.user });
      }

      setCookie('auth-token', result?.user?.refreshToken);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      className='mt-1.5 sm:mt-3 text-white bg-blue-600 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm sm:text-md p-3 text-center inline-flex justify-center items-center w-full'
      onClick={signInWithGoogle}
    >
      <svg
        className='w-4 h-4 me-2'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 18 19'
      >
        <path
          fillRule='evenodd'
          d='M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z'
          clipRule='evenodd'
        />
      </svg>
      Sign in with Google
    </button>
  );
};
export default SignInWithGoogle;
