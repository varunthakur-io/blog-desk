import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import App from './App.jsx';
import { authService } from './services/authService.js';
import { setUser, clearUser, setLoading } from './store/authSlice.js';

const Root = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      store.dispatch(setLoading(true));
      try {
        const user = await authService.getAccount();
        store.dispatch(setUser(user));
      } catch (error) {
        store.dispatch(clearUser());
        console.error('No user found:', error.message);
      } finally {
        store.dispatch(setLoading(false));
        setIsAuthChecked(true);
      }
    };
    checkUser();
  }, []);

  if (!isAuthChecked) {
    return (
      <div className=" bg-gray-900 text-white flex justify-center items-center h-screen text-2xl ">
        Loading...
      </div>
    );
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;
