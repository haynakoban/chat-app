import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// assets
import Logo from '../../assets/logo.png';

// hooks
import useCookies from '../../hooks/useCookies';

const routes = [
  {
    name: 'Messages',
    path: '/',
  },
];

const authRoutes = [
  {
    name: 'Sign Up',
    path: '/register',
  },
  {
    name: 'Login',
    path: '/login',
  },
];

const Navigation = () => {
  const { removeCookie, getCookie } = useCookies();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) setToggle(false);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const authToken = getCookie('auth-token');

    authToken ? setIsAuth(true) : setIsAuth(false);
  }, [getCookie]);

  const handleLogout = () => {
    removeCookie('auth-token');
  };

  return (
    <div className='border-b border-gray-50'>
      <div className='container mx-auto relative'>
        <div className='flex justify-between items-center px-5 h-16 sm:h-20'>
          <button onClick={() => navigate('/')}>
            <img
              src={Logo}
              alt='Logo'
              className='w-9 h-9 object-cover rounded-full'
            />
          </button>

          {/* mobile icon */}
          <div
            className={`block sm:hidden z-50 burger navbar-toggler ${
              toggle && 'toggle'
            }`}
            onClick={() => setToggle((toggle) => !toggle)}
          >
            <div className={`line1 ${toggle && '!bg-[#202128]'}`}></div>
            <div className={`line2 ${toggle && '!bg-[#202128]'}`}></div>
            <div className={`line3 ${toggle && '!bg-[#202128]'}`}></div>
          </div>

          {/* desktop links */}
          <div className='hidden sm:flex flex-row items-end'>
            {routes.map((route) => (
              <button
                key={route.name}
                className='w-full sm:w-auto text-right text-white font-medium hover:bg-white hover:text-gray-800 hover:font-semibold focus:outline-none rounded-md text-md px-5 py-2.5'
                onClick={() => {
                  setToggle(false);
                  navigate(route.path);
                }}
              >
                {route.name}
              </button>
            ))}

            {!isAuth ? (
              authRoutes.map((route) => (
                <button
                  key={route.name}
                  className='w-full sm:w-auto text-right text-white font-medium hover:bg-white hover:text-gray-800 hover:font-semibold focus:outline-none rounded-md text-md px-5 py-2.5'
                  onClick={() => {
                    setToggle(false);
                    navigate(route.path);
                  }}
                >
                  {route.name}
                </button>
              ))
            ) : (
              <button
                className='w-full sm:w-auto text-right text-white font-medium hover:bg-white hover:text-gray-800 hover:font-semibold focus:outline-none rounded-md text-md px-5 py-2.5'
                onClick={() => {
                  setToggle(false);
                  handleLogout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* mobile links */}
        {toggle && (
          <div className='absolute top-0 right-0 h-screen w-64 z-40 bg-slate-100 pt-20'>
            <div className='flex flex-col items-end'>
              {routes.map((route) => (
                <button
                  key={route.name}
                  className='w-full text-right text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none font-semibold text-md px-5 py-2.5'
                  onClick={() => {
                    setToggle(false);
                    navigate(route.path);
                  }}
                >
                  {route.name}
                </button>
              ))}

              {!isAuth ? (
                authRoutes.map((route) => (
                  <button
                    key={route.name}
                    className='w-full text-right text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none font-semibold text-md px-5 py-2.5'
                    onClick={() => {
                      setToggle(false);
                      navigate(route.path);
                    }}
                  >
                    {route.name}
                  </button>
                ))
              ) : (
                <button
                  className='w-full text-right text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none font-semibold text-md px-5 py-2.5'
                  onClick={() => {
                    setToggle(false);
                    handleLogout();
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
