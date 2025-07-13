import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type ExperienceKey = 'cooking' | 'homestay' | 'cultural';

type BookingData = {
  experience: ExperienceKey;
  dates: { checkin: string; checkout: string };
  guests: number;
  specialRequests: string;
  contact: { name: string; email: string; phone: string };
  payment: { method: string; card: { number: string; expiry: string; cvv: string; name: string } };
};

interface BookingErrors {
  dates?: { checkin?: string; checkout?: string };
  contact?: { name?: string; email?: string; phone?: string };
  payment?: { card?: { number?: string; expiry?: string; cvv?: string; name?: string } };
}

const BookingFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: '1', title: 'Select Experience', icon: Calendar },
    { id: '2', title: 'Guest Details', icon: Users },
    { id: '3', title: 'Payment', icon: CreditCard },
    { id: '4', title: 'Confirmation', icon: Shield }
  ] as const;

  type StepId = typeof steps[number]['id'];
  
  const [currentStep, setCurrentStep] = useState<StepId>('1');
  const [bookingData, setBookingData] = useState<BookingData>({
    experience: 'cooking',
    dates: { checkin: '', checkout: '' },
    guests: 1,
    specialRequests: '',
    contact: { name: '', email: '', phone: '' },
    payment: { method: 'card', card: { number: '', expiry: '', cvv: '', name: '' } }
  });

  const experiences: Record<ExperienceKey, { title: string; price: number; duration: string }> = {
    cooking: { title: 'Traditional Cooking Class', price: 45, duration: '4 hours' },
    homestay: { title: 'Cultural Homestay Experience', price: 35, duration: '2-7 days' },
    cultural: { title: 'Cultural Walking Tour', price: 25, duration: '3 hours' }
  };

  const validateStep = (step: StepId): boolean => {
    const newErrors: BookingErrors = {};
    let isValid = true;

    switch (step) {
      case '1':
        if (!bookingData.dates.checkin) {
          newErrors.dates = { ...newErrors.dates, checkin: 'Check-in date is required' };
          isValid = false;
        }
        if (!bookingData.dates.checkout) {
          newErrors.dates = { ...newErrors.dates, checkout: 'Check-out date is required' };
          isValid = false;
        }
        if (bookingData.dates.checkin && bookingData.dates.checkout &&
            new Date(bookingData.dates.checkin) >= new Date(bookingData.dates.checkout)) {
          newErrors.dates = { ...newErrors.dates, checkout: 'Check-out date must be after check-in date' };
          isValid = false;
        }
        break;

      case '2':
        if (!bookingData.contact.name) {
          newErrors.contact = { ...newErrors.contact, name: 'Name is required' };
          isValid = false;
        }
        if (!bookingData.contact.email) {
          newErrors.contact = { ...newErrors.contact, email: 'Email is required' };
          isValid = false;
        }
        if (!bookingData.contact.phone) {
          newErrors.contact = { ...newErrors.contact, phone: 'Phone number is required' };
          isValid = false;
        }
        break;

      case '3':
        if (!bookingData.payment.card.number) {
          newErrors.payment = { card: { number: 'Card number is required' } };
          isValid = false;
        }
        if (!bookingData.payment.card.expiry) {
          newErrors.payment = { ...newErrors.payment, card: { ...newErrors.payment?.card, expiry: 'Expiry date is required' } };
          isValid = false;
        }
        if (!bookingData.payment.card.cvv) {
          newErrors.payment = { ...newErrors.payment, card: { ...newErrors.payment?.card, cvv: 'CVV is required' } };
          isValid = false;
        }
        if (!bookingData.payment.card.name) {
          newErrors.payment = { ...newErrors.payment, card: { ...newErrors.payment?.card, name: 'Cardholder name is required' } };
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...bookingData,
          hostId: id,
          userId: user?.id,
          status: 'pending',
          totalAmount: total * bookingData.guests
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setCurrentStep('4');
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ payment: { card: { number: 'Failed to process payment. Please try again.' } } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (validateStep(currentStep)) {
      if (currentStep === '3') {
        await handleSubmit();
      } else {
        const nextStep = steps[steps.findIndex(s => s.id === currentStep) + 1];
        if (nextStep) {
          setCurrentStep(nextStep.id);
        }
      }
    }
  };

  const handlePrevious = () => {
    const prevStep = steps[steps.findIndex(s => s.id === currentStep) - 1];
    if (prevStep) {
      setCurrentStep(prevStep.id);
      setErrors({});
    }
  };

  const handleInputChange = <T extends 'dates' | 'contact'>(
    section: T,
    field: keyof BookingData[T],
    value: string
  ) => {
    setBookingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCardInputChange = (
    field: keyof BookingData['payment']['card'],
    value: string
  ) => {
    setBookingData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        card: {
          ...prev.payment.card,
          [field]: value
        }
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
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    steps.findIndex(s => s.id === currentStep) >= index
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  steps.findIndex(s => s.id === currentStep) >= index
                    ? 'text-orange-500'
                    : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200 mx-4 hidden md:block">
                    <div
                      className={`h-full ${
                        steps.findIndex(s => s.id === currentStep) > index
                          ? 'bg-orange-500'
                          : 'bg-gray-200'
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
              {currentStep === '1' && (
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
                        onClick={() => setBookingData(prev => ({ ...prev, experience: key as ExperienceKey }))}
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
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.dates?.checkin ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={bookingData.dates.checkin}
                          onChange={(e) => handleInputChange('dates', 'checkin', e.target.value)}
                        />
                        {errors.dates?.checkin && (
                          <p className="mt-1 text-sm text-red-600">{errors.dates.checkin}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.dates?.checkout ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={bookingData.dates.checkout}
                          onChange={(e) => handleInputChange('dates', 'checkout', e.target.value)}
                        />
                        {errors.dates?.checkout && (
                          <p className="mt-1 text-sm text-red-600">{errors.dates.checkout}</p>
                        )}
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

              {currentStep === '2' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.contact?.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={bookingData.contact.name}
                        onChange={(e) => handleInputChange('contact', 'name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                      {errors.contact?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.contact.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.contact?.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={bookingData.contact.email}
                        onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                      />
                      {errors.contact?.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.contact.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.contact?.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={bookingData.contact.phone}
                        onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                      />
                      {errors.contact?.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.contact.phone}</p>
                      )}
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

              {currentStep === '3' && (
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
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.payment?.card?.number ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={bookingData.payment.card.number}
                        onChange={(e) => handleCardInputChange('number', e.target.value)}
                      />
                      {errors.payment?.card?.number && (
                        <p className="mt-1 text-sm text-red-600">{errors.payment.card.number}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.payment?.card?.expiry ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={bookingData.payment.card.expiry}
                          onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                        />
                        {errors.payment?.card?.expiry && (
                          <p className="mt-1 text-sm text-red-600">{errors.payment.card.expiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            errors.payment?.card?.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={bookingData.payment.card.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        />
                        {errors.payment?.card?.cvv && (
                          <p className="mt-1 text-sm text-red-600">{errors.payment.card.cvv}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          errors.payment?.card?.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={bookingData.payment.card.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                      />
                      {errors.payment?.card?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.payment.card.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === '4' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Confirmation</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <Shield className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-lg font-semibold text-green-800">Booking Confirmed!</h3>
                    </div>
                    <p className="text-green-700">
                      Your cultural experience has been successfully booked. 
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
                      <p className="text-gray-600">${(total * bookingData.guests).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === '1'}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                    currentStep === '1'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
                
                {currentStep !== '4' ? (
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className={`flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Next'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/guest-dashboard')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View My Bookings
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