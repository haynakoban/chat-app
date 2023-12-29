import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// pages
import { ComposeMessage, Home, Login, Messages, Register } from '../pages';

// hooks
import useCookies from '../hooks/useCookies';

const AppRoutes = () => {
  const { getCookie } = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = getCookie('auth-token');

    // Check if 'auth-token' cookie is not present
    if (
      !authToken &&
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/register'
    ) {
      navigate('/login');
    }
  }, [getCookie, navigate]);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='compose' element={<ComposeMessage />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path=':id' element={<Messages />} />
    </Routes>
  );
};
export default AppRoutes;
