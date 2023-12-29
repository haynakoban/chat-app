import Navigation from './Navigation';

const MainLayout = ({ children }) => {
  return (
    <div className='h-screen'>
      {/* navigation */}
      <Navigation />

      <div className='container mx-auto px-0 sm:px-5 '>{children}</div>
    </div>
  );
};
export default MainLayout;
