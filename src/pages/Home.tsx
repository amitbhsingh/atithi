import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ChefHat, Star, Globe, Heart, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Live Like a Local
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with authentic families, learn traditional cooking, and experience 
              genuine cultural immersion beyond typical tourism
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Find Your Cultural Experience
              </Link>
              <Link
                to="/host-dashboard"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
              >
                Share Your Culture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How CulturalStay Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience authentic cultural exchange with local families who share their traditions, 
              recipes, and way of life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Find Your Match</h3>
              <p className="text-gray-600">
                Browse verified local families offering authentic cultural experiences, 
                cooking classes, and homestay opportunities
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="h-10 w-10 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Learn & Cook</h3>
              <p className="text-gray-600">
                Join family meals, learn traditional recipes, and discover 
                authentic flavors passed down through generations
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect & Share</h3>
              <p className="text-gray-600">
                Build lasting friendships, share stories, and create 
                meaningful connections across cultures
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose CulturalStay?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We focus on authentic experiences with middle-class families who want to share 
              their culture and traditions with curious travelers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Verified Families</h3>
              <p className="text-gray-600">
                All host families are carefully verified with income and background checks 
                to ensure authentic, safe experiences
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ChefHat className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Authentic Cooking</h3>
              <p className="text-gray-600">
                Learn traditional recipes and cooking techniques passed down 
                through generations in real family kitchens
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Globe className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Cultural Immersion</h3>
              <p className="text-gray-600">
                Experience daily life, local customs, and traditions 
                beyond typical tourist attractions
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Star className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
              <p className="text-gray-600">
                Comprehensive review system ensures high-quality experiences 
                for both hosts and guests
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <MapPin className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Local Insights</h3>
              <p className="text-gray-600">
                Discover hidden gems, local markets, and authentic experiences 
                only locals know about
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Heart className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Meaningful Connections</h3>
              <p className="text-gray-600">
                Build lasting friendships and create memories that go far 
                beyond a typical vacation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Cultural Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered authentic cultural experiences 
            with local families around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Exploring
            </Link>
            <Link
              to="/host-dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;