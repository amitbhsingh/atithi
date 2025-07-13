import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HostDashboard from './pages/HostDashboard';
import GuestDashboard from './pages/GuestDashboard';
import Search from './pages/Search';
import HostProfile from './pages/HostProfile';
import BookingFlow from './pages/BookingFlow';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/host-dashboard" element={<HostDashboard />} />
            <Route path="/guest-dashboard" element={<GuestDashboard />} />
            <Route path="/host/:id" element={<HostProfile />} />
            <Route path="/book/:id" element={<BookingFlow />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;