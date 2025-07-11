import './App.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { Routes, Route } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="*"
        element={<h1 className="text-center mt-10">404 Page Not Found</h1>}
      />
    </Routes>
  );
}

export default App;
