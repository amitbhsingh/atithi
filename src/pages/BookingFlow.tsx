import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, CreditCard, Shield, ArrowLeft, ArrowRight } from 'lucide-react';

const BookingFlow: React.FC = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    experience: 'cooking',
    dates: { checkin: '', checkout: '' },
    guests: 1,
    specialRequests: '',
    contact: { name: '', email: '', phone: '' },
    payment: { method: 'card', card: { number: '', expiry: '', cvv: '', name: '' } }
  });

  const steps = [
    { id: 1, title: 'Select Experience', icon: Calendar },
    { id: 2, title: 'Guest Details', icon: Users },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Confirmation', icon: Shield }
  ];

  const experiences = {
    cooking: { title: 'Traditional Paella Cooking Class', price: 45, duration: '4 hours' },
    homestay: { title: 'Cultural Homestay Experience', price: 35, duration: '2-7 days' },
    cultural: { title: 'Barcelona Cultural Walking Tour', price: 25, duration: '3 hours' }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const calculateTotal = () => {
    const basePrice = experiences[bookingData.experience].price;
    const serviceFee = basePrice * 0.1;
    const total = basePrice + serviceFee;
    return { basePrice, serviceFee, total };
  };

  const { basePrice, serviceFee, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-orange-500' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </span>
                {step.id < steps.length && (
                  <div className="w-16 h-0.5 bg-gray-200 mx-4 hidden md:block">
                    <div
                      className={`h-full ${
                        currentStep > step.id ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Experience</h2>
                  <div className="space-y-4">
                    {Object.entries(experiences).map(([key, experience]) => (
                      <div
                        key={key}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          bookingData.experience === key
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setBookingData(prev => ({ ...prev, experience: key }))}
                      >
                        <h3 className="font-semibold text-gray-800">{experience.title}</h3>
                        <p className="text-sm text-gray-600">{experience.duration}</p>
                        <p className="text-lg font-bold text-orange-600 mt-2">${experience.price}/person</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={bookingData.dates.checkin}
                          onChange={(e) => handleInputChange('dates', 'checkin', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={bookingData.dates.checkout}
                          onChange={(e) => handleInputChange('dates', 'checkout', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={bookingData.guests}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={bookingData.contact.name}
                        onChange={(e) => handleInputChange('contact', 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={bookingData.contact.email}
                        onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={bookingData.contact.phone}
                        onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Any dietary restrictions, allergies, or special requests..."
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={bookingData.payment.card.number}
                        onChange={(e) => handleInputChange('payment', 'card', { ...bookingData.payment.card, number: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={bookingData.payment.card.expiry}
                          onChange={(e) => handleInputChange('payment', 'card', { ...bookingData.payment.card, expiry: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={bookingData.payment.card.cvv}
                          onChange={(e) => handleInputChange('payment', 'card', { ...bookingData.payment.card, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={bookingData.payment.card.name}
                        onChange={(e) => handleInputChange('payment', 'card', { ...bookingData.payment.card, name: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Confirmation</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800">Booking Confirmed!</h3>
                    </div>
                    <p className="text-green-700">
                      Your cultural experience with Maria Santos has been successfully booked. 
                      You'll receive a confirmation email shortly with all the details.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Experience Details</h4>
                      <p className="text-gray-600">{experiences[bookingData.experience].title}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Dates</h4>
                      <p className="text-gray-600">{bookingData.dates.checkin} - {bookingData.dates.checkout}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Guests</h4>
                      <p className="text-gray-600">{bookingData.guests} {bookingData.guests === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Total Paid</h4>
                      <p className="text-gray-600">${total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                    currentStep === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                ) : (
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{experiences[bookingData.experience].title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{bookingData.guests}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">${basePrice} x {bookingData.guests} guests</span>
                    <span className="font-medium">${(basePrice * bookingData.guests).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">${(serviceFee * bookingData.guests).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                    <span>Total</span>
                    <span>${(total * bookingData.guests).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;