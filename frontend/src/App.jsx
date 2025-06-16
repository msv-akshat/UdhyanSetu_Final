// src/App.js
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import SubNavbar from './components/SubNavbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import About from './components/About';
import Downloads from './components/Downloads';
import { AuthContext } from './contexts/AuthContext';
import Analytics from './components/Analytics';
import Uploads from './components/Uploads';

function AppContent() {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  const hideSubNavOn = ['/', '/login', '/register'];
  const shouldShowSubNav = isLoggedIn && !hideSubNavOn.includes(location.pathname);

  return (
    <>
      <NavBar />
      {shouldShowSubNav && <SubNavbar />}
      <Routes>
        <Route path='/' element={<Home title="Home" />} />
        <Route path='/about' element={<About title="About" />} />
        <Route path="/login" element={<Login title="User Login" />} />
        <Route path="/register" element={<Register title="Register Farmer" />} />
        <Route path='/download' element={<Downloads title="Download Data" />} />
        <Route path='/analytics' element={<Analytics title="Analytics" />} />
        <Route path='/uploads' element={<Uploads title="Upload Data" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
