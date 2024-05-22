import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';

const AppContent = () => {
  return (
    <AppRouter />
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
