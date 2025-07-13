const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send verification email
const sendVerificationEmail = async (email, token, type = 'verify') => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@culturalstay.com',
      to: email,
      subject: type === 'verify' ? 'Verify your CulturalStay account' : 'Reset your password',
      html: type === 'verify' ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to CulturalStay!</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px;">
            Verify Email
          </a>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`${type} email sent to ${email}`);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

// Send booking confirmation
const sendBookingConfirmation = async (booking) => {
  try {
    const guestEmail = booking.guest.email;
    const hostEmail = booking.host.user.email;
    const guestName = `${booking.guest.firstName} ${booking.guest.lastName}`;
    const hostName = `${booking.host.user.firstName} ${booking.host.user.lastName}`;

    // Email to guest
    const guestMailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@culturalstay.com',
      to: guestEmail,
      subject: 'Booking Confirmation - CulturalStay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Booking Confirmed!</h2>
          <p>Hi ${guestName},</p>
          <p>Your booking with ${hostName} has been confirmed!</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Experience:</strong> ${booking.experience}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
            <p><strong>Guests:</strong> ${booking.guests.adults} adults</p>
            <p><strong>Total:</strong> $${booking.pricing.total}</p>
          </div>
          <p>Have a wonderful cultural experience!</p>
        </div>
      `
    };

    // Email to host
    const hostMailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@culturalstay.com',
      to: hostEmail,
      subject: 'New Booking Received - CulturalStay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Booking Received!</h2>
          <p>Hi ${hostName},</p>
          <p>You have a new booking from ${guestName}!</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3>Booking Details:</h3>
            <p><strong>Experience:</strong> ${booking.experience}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
            <p><strong>Guests:</strong> ${booking.guests.adults} adults</p>
            <p><strong>Total:</strong> $${booking.pricing.total}</p>
          </div>
          <p>Please prepare for your guests' arrival!</p>
        </div>
      `
    };

    await transporter.sendMail(guestMailOptions);
    await transporter.sendMail(hostMailOptions);
    
    console.log('Booking confirmation emails sent');
  } catch (error) {
    console.error('Booking confirmation email error:', error);
    throw error;
  }
};

// Send booking cancellation
const sendBookingCancellation = async (booking) => {
  try {
    const guestEmail = booking.guest.email;
    const hostEmail = booking.host.user.email;
    const guestName = `${booking.guest.firstName} ${booking.guest.lastName}`;
    const hostName = `${booking.host.user.firstName} ${booking.host.user.lastName}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@culturalstay.com',
      to: [guestEmail, hostEmail],
      subject: 'Booking Cancelled - CulturalStay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Booking Cancelled</h2>
          <p>The booking between ${guestName} and ${hostName} has been cancelled.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3>Cancelled Booking Details:</h3>
            <p><strong>Experience:</strong> ${booking.experience}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
            <p><strong>Cancelled by:</strong> ${booking.cancellation.cancelledBy}</p>
            <p><strong>Reason:</strong> ${booking.cancellation.reason || 'No reason provided'}</p>
          </div>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking cancellation emails sent');
  } catch (error) {
    console.error('Booking cancellation email error:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendBookingConfirmation,
  sendBookingCancellation
};