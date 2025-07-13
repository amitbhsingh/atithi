import React, { useState } from 'react';
import { Plus, Users, Star, Calendar, MessageCircle, DollarSign, CheckCircle } from 'lucide-react';

const HostDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Bookings', value: '23', icon: Calendar, color: 'blue' },
    { label: 'Average Rating', value: '4.8', icon: Star, color: 'yellow' },
    { label: 'Total Earnings', value: '$1,250', icon: DollarSign, color: 'green' },
    { label: 'Response Rate', value: '95%', icon: MessageCircle, color: 'purple' }
  ];

  const upcomingBookings = [
    {
      id: 1,
      guest: 'Sarah Johnson',
      dates: 'Mar 15-18, 2024',
      experience: 'Cooking Class + Homestay',
      status: 'confirmed',
      amount: '$180'
    },
    {
      id: 2,
      guest: 'Michael Chen',
      dates: 'Mar 22-24, 2024',
      experience: 'Cultural Tour + Cooking',
      status: 'pending',
      amount: '$150'
    },
    {
      id: 3,
      guest: 'Emma Rodriguez',
      dates: 'Apr 1-3, 2024',
      experience: 'Weekend Homestay',
      status: 'confirmed',
      amount: '$120'
    }
  ];

  const reviews = [
    {
      id: 1,
      guest: 'Alex Thompson',
      rating: 5,
      date: 'Feb 28, 2024',
      comment: 'Absolutely amazing experience! Maria and her family were so welcoming and taught me authentic Spanish cooking techniques. The paella we made was incredible!'
    },
    {
      id: 2,
      guest: 'Lisa Park',
      rating: 5,
      date: 'Feb 15, 2024',
      comment: 'This was the highlight of my trip to Barcelona. The family treated me like their own and I learned so much about Spanish culture and cuisine.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Host Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Maria! Here's your hosting overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Experience
              </button>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Verified Host</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'bookings', 'reviews', 'earnings', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Bookings</h3>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{booking.guest}</h4>
                            <p className="text-sm text-gray-600">{booking.dates}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">{booking.amount}</p>
                          <p className="text-sm text-gray-600">{booking.experience}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                          <button className="text-orange-500 hover:text-orange-600">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-800">{review.guest}</h4>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">All Bookings</h3>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{booking.guest}</h4>
                          <p className="text-sm text-gray-600">{booking.dates}</p>
                          <p className="text-sm text-gray-600">{booking.experience}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{booking.amount}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{review.guest}</h4>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-medium text-green-800">This Month</h4>
                    <p className="text-2xl font-bold text-green-600">$450</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-medium text-blue-800">Total Earnings</h4>
                    <p className="text-2xl font-bold text-blue-600">$1,250</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-medium text-purple-800">Pending</h4>
                    <p className="text-2xl font-bold text-purple-600">$150</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Host Profile</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Host Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Maria Santos"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Your Family
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="We are a traditional Spanish family from Barcelona who loves sharing our culture and cuisine with travelers from around the world. Our grandmother's recipes have been passed down through generations."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialties
                    </label>
                    <input
                      type="text"
                      defaultValue="Paella, Tapas, Sangria, Traditional Spanish Cooking"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;