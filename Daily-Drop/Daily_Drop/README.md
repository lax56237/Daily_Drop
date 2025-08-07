# Email Reset Application

This application allows users to request a password reset by entering their email address. The system will send an OTP to the provided email using nodemailer.

## Features

- Email input validation
- OTP generation and email sending
- Modern UI with loading states
- Error handling and success messages

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## How to Use

1. Open the application in your browser
2. Navigate to the Forgot Password page
3. Enter your email address
4. Click "Send Reset Email"
5. Check your email for the OTP

## Email Configuration

The application is configured to use Gmail SMTP. Make sure to:

1. Use a valid Gmail account
2. Generate an App Password for the Gmail account
3. Update the email credentials in `backend/server.js` if needed

## API Endpoints

- `POST /send-email` - Sends password reset email
  - Body: `{ "email": "user@example.com" }`
  - Response: `{ "success": true, "message": "Email sent successfully" }`

## Security Notes

- In production, store OTPs in a database with expiration times
- Use environment variables for email credentials
- Implement rate limiting for email sending
- Add proper authentication and authorization 