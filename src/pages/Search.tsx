import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Star, ChefHat, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const hosts = [
    {
      id: 1,
      name: 'Maria Santos',
      location: 'Barcelona, Spain',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 127,
      specialties: ['Paella', 'Tapas', 'Sangria'],
      price: 45,
      familySize: 4,
      languages: ['Spanish', 'English'],
      description: 'Traditional Spanish family offering authentic paella cooking classes and cultural immersion.'
    },
    {
      id: 2,
      name: 'Raj Patel',
      location: 'Mumbai, India',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 203,
      specialties: ['Curry', 'Biryani', 'Chai'],
      price: 25,
      familySize: 6,
      languages: ['Hindi', 'English'],
      description: 'Experience authentic Indian spices and cooking techniques with our multigenerational family.'
    },
    {
      id: 3,
      name: 'Yuki Tanaka',
      location: 'Kyoto, Japan',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 89,
      specialties: ['Sushi', 'Ramen', 'Tea Ceremony'],
      price: 65,
      familySize: 3,
      languages: ['Japanese', 'English'],
      description: 'Learn traditional Japanese cuisine and tea ceremony in our historic Kyoto home.'
    },
    {
      id: 4,
      name: 'Giuseppe Rossi',
      location: 'Rome, Italy',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 156,
      specialties: ['Pasta', 'Pizza', 'Gelato'],
      price: 50,
      familySize: 5,
      languages: ['Italian', 'English'],
      description: 'Join our Roman family for homemade pasta lessons and authentic Italian dining experiences.'
    },
    {
      id: 5,
      name: 'Fatima Al-Rashid',
      location: 'Marrakech, Morocco',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 142,
      specialties: ['Tagine', 'Couscous', 'Mint Tea'],
      price: 35,
      familySize: 7,
      languages: ['Arabic', 'French', 'English'],
      description: 'Experience Moroccan hospitality and learn traditional Berber cooking techniques.'
    },
    {
      id: 6,
      name: 'Carlos Mendoza',
      location: 'Oaxaca, Mexico',
      image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 98,
      specialties: ['Mole', 'Tamales', 'Mezcal'],
      price: 30,
      familySize: 4,
      languages: ['Spanish', 'English'],
      description: 'Discover authentic Oaxacan cuisine and traditional cooking methods with our family.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Experiences' },
    { id: 'cooking', name: 'Cooking Classes' },
    { id: 'homestay', name: 'Homestay' },
    { id: 'cultural', name: 'Cultural Tours' },
    { id: 'language', name: 'Language Exchange' }
  ];

  const filteredHosts = hosts.filter(host =>
    host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    host.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    host.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, cuisine, or host name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHosts.map(host => (
            <div key={host.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={host.image}
                alt={host.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{host.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{host.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{host.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{host.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {host.specialties.map(specialty => (
                    <span
                      key={specialty}
                      className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Family of {host.familySize}</span>
                  </div>
                  <div className="flex items-center">
                    <ChefHat className="h-4 w-4 mr-1" />
                    <span>{host.reviews} reviews</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-800">
                    ${host.price}/day
                  </div>
                  <Link
                    to={`/host/${host.id}`}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHosts.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hosts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all available experiences.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;