import React, { useState } from 'react';
import { Calendar, MapPin, Star, MessageCircle, Clock, Camera } from 'lucide-react';

const GuestDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingTrips = [
    {
      id: 1,
      host: 'Maria Santos',
      location: 'Barcelona, Spain',
      dates: 'Mar 15-18, 2024',
      experience: 'Cooking Class + Homestay',
      status: 'confirmed',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
      amount: '$180'
    },
    {
      id: 2,
      host: 'Yuki Tanaka',
      location: 'Kyoto, Japan',
      dates: 'Apr 20-25, 2024',
      experience: 'Tea Ceremony + Cultural Tour',
      status: 'pending',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      amount: '$325'
    }
  ];

  const pastTrips = [
    {
      id: 3,
      host: 'Raj Patel',
      location: 'Mumbai, India',
      dates: 'Feb 10-14, 2024',
      experience: 'Curry Cooking + Homestay',
      status: 'completed',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      amount: '$125',
      rating: 5
    },
    {
      id: 4,
      host: 'Giuseppe Rossi',
      location: 'Rome, Italy',
      dates: 'Jan 15-18, 2024',
      experience: 'Pasta Making + Cultural Tour',
      status: 'completed',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      amount: '$200',
      rating: 4
    }
  ];

  const wishlist = [
    {
      id: 5,
      host: 'Fatima Al-Rashid',
      location: 'Marrakech, Morocco',
      experience: 'Tagine Cooking + Cultural Tour',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$35/day'
    },
    {
      id: 6,
      host: 'Carlos Mendoza',
      location: 'Oaxaca, Mexico',
      experience: 'Mole Cooking + Homestay',
      image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '$30/day'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
              <p className="text-gray-600 mt-1">Manage your cultural experiences and memories</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Experiences</p>
              <p className="text-2xl font-bold text-orange-500">6</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['upcoming', 'past', 'wishlist'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab === 'upcoming' ? 'Upcoming Trips' : tab === 'past' ? 'Past Trips' : 'Wishlist'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <img
                          src={trip.image}
                          alt={trip.host}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{trip.host}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{trip.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">{trip.dates}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{trip.experience}</p>
                          <p className="font-semibold text-gray-800">{trip.amount}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            trip.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                            View Details
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            Message Host
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="space-y-6">
                {pastTrips.map((trip) => (
                  <div key={trip.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <img
                          src={trip.image}
                          alt={trip.host}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{trip.host}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{trip.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">{trip.dates}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < trip.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{trip.experience}</p>
                          <p className="font-semibold text-gray-800">{trip.amount}</p>
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                            <Camera className="h-4 w-4 mr-2" />
                            Photos
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            Book Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={item.image}
                      alt={item.host}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">{item.host}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{item.experience}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-semibold text-gray-800">{item.price}</span>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Message a Host</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Find New Experience</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Write a Review</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;