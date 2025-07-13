import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Users, Calendar, ChefHat, Globe, Heart, MessageCircle, Share2 } from 'lucide-react';

const HostProfile: React.FC = () => {
  const { id } = useParams();
  const [selectedExperience, setSelectedExperience] = useState('cooking');

  const host = {
    id: 1,
    name: 'Maria Santos',
    location: 'Barcelona, Spain',
    image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviews: 127,
    familySize: 4,
    languages: ['Spanish', 'English'],
    description: 'Hola! I\'m Maria, a passionate cook and proud Barcelona native. My family has been sharing our traditional Spanish recipes and cultural traditions for generations. We live in a cozy apartment in the heart of Barcelona, where the aroma of paella and the sound of flamenco guitar fill our home. We believe that food is the best way to connect with people and share our beautiful culture.',
    specialties: ['Paella', 'Tapas', 'Sangria', 'Gazpacho', 'Tortilla Española'],
    galleryImages: [
      'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  };

  const experiences = {
    cooking: {
      title: 'Traditional Paella Cooking Class',
      duration: '4 hours',
      price: 45,
      description: 'Learn to make authentic Valencian paella from scratch using traditional techniques passed down through generations. We\'ll visit the local market together, select the freshest ingredients, and cook in our family kitchen.',
      includes: ['Market tour', 'Cooking lesson', 'Family meal', 'Recipe book', 'Sangria tasting']
    },
    homestay: {
      title: 'Cultural Homestay Experience',
      duration: '2-7 days',
      price: 35,
      description: 'Stay with our family and experience daily life in Barcelona. Share meals, learn Spanish phrases, and discover local neighborhoods away from tourist crowds.',
      includes: ['Private room', 'Family meals', 'Local neighborhood tours', 'Cultural activities', 'Language practice']
    },
    cultural: {
      title: 'Barcelona Cultural Walking Tour',
      duration: '3 hours',
      price: 25,
      description: 'Explore Barcelona through local eyes. Visit hidden gems, local markets, and authentic tapas bars while learning about our city\'s rich history and culture.',
      includes: ['Walking tour', 'Tapas tasting', 'Local insights', 'Photo opportunities', 'Market visits']
    }
  };

  const reviews = [
    {
      id: 1,
      guest: 'Sarah Johnson',
      rating: 5,
      date: 'February 2024',
      comment: 'Absolutely incredible experience! Maria and her family welcomed me with open arms and taught me so much about Spanish culture. The paella we made was restaurant-quality, and I loved learning about the local traditions. Highly recommend!',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      guest: 'Michael Chen',
      rating: 5,
      date: 'January 2024',
      comment: 'This was the highlight of my Barcelona trip. Maria\'s family treated me like one of their own, and I learned authentic cooking techniques I\'ll use forever. The cultural insights were invaluable.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      guest: 'Emma Rodriguez',
      rating: 5,
      date: 'December 2023',
      comment: 'Maria is an amazing host and teacher. Her passion for Spanish culture is contagious, and her family made me feel so welcome. The food was incredible and the experience unforgettable.',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-r from-orange-500 to-pink-600">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center space-x-4">
                <img
                  src={host.image}
                  alt={host.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold">{host.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-1" />
                      <span>{host.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 mr-1 text-yellow-400 fill-current" />
                      <span>{host.rating} ({host.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Maria & Family</h2>
              <p className="text-gray-700 mb-6">{host.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span className="text-gray-700">Family of {host.familySize}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-orange-500" />
                  <span className="text-gray-700">{host.languages.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-5 w-5 text-orange-500" />
                  <span className="text-gray-700">{host.specialties.length} specialties</span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Culinary Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {host.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {host.galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Guest Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={review.avatar}
                        alt={review.guest}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.guest}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Experience Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Experience</h3>
              <div className="space-y-3">
                {Object.entries(experiences).map(([key, experience]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedExperience(key)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedExperience === key
                        ? 'border-orange-500 bg-orange-50 text-orange-800'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{experience.title}</div>
                    <div className="text-sm text-gray-600">{experience.duration} • ${experience.price}/person</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Experience Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {experiences[selectedExperience].title}
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{experiences[selectedExperience].duration}</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  ${experiences[selectedExperience].price}/person
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{experiences[selectedExperience].description}</p>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">What's Included:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {experiences[selectedExperience].includes.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  Book Now
                </button>
                <div className="flex space-x-2">
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                </div>
                <button className="w-full border border-orange-500 text-orange-500 py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Host
                </button>
              </div>
            </div>

            {/* Safety & Verification */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Safety & Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Identity Verified</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Income Verified</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Background Checked</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">CulturalStay Superhost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;