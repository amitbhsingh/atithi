# CulturalStay Backend API

A comprehensive backend API for the CulturalStay platform, enabling cultural exchange through homestays and authentic experiences.

## Features

- **User Management**: Registration, authentication, profile management
- **Host Profiles**: Comprehensive host verification and management
- **Booking System**: Full booking lifecycle with status management
- **Review System**: Bi-directional reviews between hosts and guests
- **Communication**: In-app messaging system
- **Income Verification**: Special verification for middle-class families
- **Cultural Experiences**: Cooking classes, homestays, cultural tours

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email notifications
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile-picture` - Upload profile picture
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete account

### Hosts
- `GET /api/hosts` - Get all hosts (with filters)
- `GET /api/hosts/:id` - Get host details
- `POST /api/hosts` - Create host profile
- `PUT /api/hosts/:id` - Update host profile
- `POST /api/hosts/:id/photos` - Upload host photos
- `POST /api/hosts/:id/experiences` - Add experience
- `PUT /api/hosts/:id/availability` - Update availability

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/messages` - Add message

### Reviews
- `GET /api/reviews/host/:hostId` - Get host reviews
- `GET /api/reviews/user/:userId` - Get user reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `POST /api/reviews/:id/response` - Add response to review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

## Database Models

### User Model
- Basic user information and authentication
- Profile details and preferences
- Role-based access (guest, host, admin)
- Email verification and password reset

### Host Model
- Detailed host profile with family information
- Address and location data
- Income verification for middle-class families
- Accommodation details and photos
- Cultural experiences and specialties
- Pricing and availability
- Ratings and verification status

### Booking Model
- Complete booking lifecycle management
- Guest and host relationship
- Experience type and details
- Payment and pricing information
- Communication history
- Status tracking and cancellation

### Review Model
- Bi-directional review system
- Detailed rating categories
- Photo uploads and highlights
- Response system
- Helpful voting system

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet for security headers
- File upload restrictions

## Income Verification

Special verification system for middle-class families:
- Document upload and verification
- Income range classification
- Background checks
- Identity verification
- Phone and email verification

## Email System

Automated email notifications for:
- Account verification
- Booking confirmations
- Cancellation notices
- Password reset
- Communication updates

## File Upload

Secure file upload system for:
- Profile pictures
- Accommodation photos
- Verification documents
- Review photos

## Error Handling

Comprehensive error handling with:
- Input validation errors
- Authentication errors
- Database errors
- File upload errors
- Custom error responses

## Performance Optimization

- Database indexing
- Query optimization
- Pagination for large datasets
- Efficient aggregation pipelines
- Caching strategies

## Testing

Run tests with:
```bash
npm test
```

## Deployment

The API is ready for deployment on platforms like:
- Heroku
- AWS
- DigitalOcean
- Railway
- Render

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.