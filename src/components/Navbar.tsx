import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, User, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-800">CulturalStay</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-gray-700 hover:text-orange-500 transition-colors">
              Find Hosts
            </Link>
            <Link to="/host-dashboard" className="text-gray-700 hover:text-orange-500 transition-colors">
              Become a Host
            </Link>
            <Link to="/guest-dashboard" className="text-gray-700 hover:text-orange-500 transition-colors">
              My Trips
            </Link>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Sign In
              </button>
              <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                Sign Up
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/search"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                Find Hosts
              </Link>
              <Link
                to="/host-dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                Become a Host
              </Link>
              <Link
                to="/guest-dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                My Trips
              </Link>
              <div className="flex flex-col space-y-2 px-3 py-2">
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Sign In
                </button>
                <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;