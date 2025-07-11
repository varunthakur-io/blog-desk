import './App.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
