import Cookies from 'universal-cookie';

const useCookies = () => {
  const cookies = new Cookies();

  // setter
  const getCookie = (name) => cookies.get(name);

  const setCookie = (name, value, options = {}) => {
    cookies.set(name, value, options);
  };

  const removeCookie = (name) => {
    cookies.remove(name);
  };

  return {
    getCookie,
    setCookie,
    removeCookie,
  };
};

export default useCookies;
