import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(  // Boots up the React app
  <BrowserRouter> {/* Wraps the app in React Router, enabling client-side routing */}
    <App /> {/* Loads the main component (where all the routing happens) */}
  </BrowserRouter>
);
