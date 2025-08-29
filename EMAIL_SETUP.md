# Email Setup for Forgot Password

## Current Status: Development Mode
By default, the system runs in **development mode** where:
- ✅ **No real emails are sent**
- ✅ **Reset URLs are logged to console**
- ✅ **Easy to test without email setup**

## How to Enable Real Emails

### Option 1: Gmail SMTP (Recommended for Testing)

#### Step 1: Install Nodemailer
```bash
npm install nodemailer
```

#### Step 2: Create .env file
Create a `.env` file in your Backend folder with:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/library_management

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
EMAIL_USE_REAL=true
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Step 3: Gmail App Password Setup
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_APP_PASSWORD`

#### Step 4: Restart Backend Server
```bash
npm start
```

### Option 2: Other Email Services

#### SendGrid
```env
EMAIL_USE_REAL=true
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_api_key
```

#### AWS SES
```env
EMAIL_USE_REAL=true
EMAIL_SERVICE=ses
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

## Testing the Setup

### 1. Test with Real Email
1. Set `EMAIL_USE_REAL=true` in your `.env` file
2. Restart the backend server
3. Request password reset from frontend
4. Check your email inbox

### 2. Test with Console Logging (Default)
1. Set `EMAIL_USE_REAL=false` or remove the variable
2. Request password reset from frontend
3. Check backend console for reset URL
4. Copy and paste the URL in your browser

## Console Output Examples

### Development Mode (Default)
```
=== PASSWORD RESET EMAIL (Development Mode) ===
To: user@example.com
Subject: Password Reset Request
Reset URL: http://localhost:5173/reset-password/abc123def456...
=============================================

💡 TIP: Copy the reset URL above and paste it in your browser to test!
```

### Real Email Mode
```
✅ Real email sent successfully to: user@example.com
```

## Troubleshooting

### Common Issues

1. **"Module not found: nodemailer"**
   - Run: `npm install nodemailer`

2. **"Authentication failed"**
   - Check your Gmail app password
   - Ensure 2FA is enabled

3. **"Connection timeout"**
   - Check your internet connection
   - Verify Gmail SMTP settings

4. **Environment variables not loading**
   - Restart the backend server after changing .env
   - Check .env file location (should be in Backend folder)

### Debug Steps

1. Check backend console for error messages
2. Verify .env file variables
3. Test Gmail credentials manually
4. Check firewall/antivirus settings

## Security Notes

- ⚠️ **Never commit .env files** to version control
- ⚠️ **Use App Passwords**, not regular passwords
- ⚠️ **Limit email permissions** to minimum required
- ✅ **Use environment variables** for sensitive data

## Production Considerations

For production deployment:
1. Use professional email services (SendGrid, AWS SES, etc.)
2. Set up proper email templates
3. Implement email rate limiting
4. Add email verification
5. Monitor email delivery rates
