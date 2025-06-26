import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ✅ Tailwind CSS
import { Provider } from 'react-redux';
import store from './redux/store'; // ✅ path to your Redux store

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* ✅ Wrap your app with Redux Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
