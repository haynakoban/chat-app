import { BrowserRouter as Router } from 'react-router-dom';

// routes
import AppRoutes from './routes';

// layout
import MainLayout from './components/layout/MainLayout';

const App = () => {
  return (
    <div id='app'>
      <Router>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </Router>
    </div>
  );
};

export default App;
