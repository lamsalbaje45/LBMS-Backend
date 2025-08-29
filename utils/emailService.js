// Email service with both development and production options
// In production, replace this with a real email service like SendGrid, AWS SES, or Nodemailer

// Development mode - logs to console
export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        // Check if we should use real email (set EMAIL_USE_REAL=true in .env)
        if (process.env.EMAIL_USE_REAL === 'true') {
            return await sendRealEmail(email, resetUrl);
        }
        
        // Development mode - log to console
        console.log('=== PASSWORD RESET EMAIL (Development Mode) ===');
        console.log('To:', email);
        console.log('Subject: Password Reset Request');
        console.log('Reset URL:', resetUrl);
        console.log('=============================================');
        console.log('');
        console.log('💡 TIP: Copy the reset URL above and paste it in your browser to test!');
        console.log('');
        
        return {
            success: true,
            message: 'Password reset email sent successfully (development mode)'
        };
    } catch (error) {
        console.error('Email service error:', error);
        return {
            success: false,
            message: 'Failed to send email'
        };
    }
};

// Real email sending function (requires setup)
const sendRealEmail = async (email, resetUrl) => {
    try {
        // This requires nodemailer to be installed and configured
        // npm install nodemailer
        const nodemailer = await import('nodemailer');
        
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD // Use App Password, not regular password
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - Library Management System',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You have requested to reset your password for the Library Management System.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #2563eb; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p><strong>Important:</strong> This link will expire in 1 hour.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px;">
                        This is an automated email from the Library Management System.
                    </p>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Real email sent successfully to:', email);
        
        return {
            success: true,
            message: 'Password reset email sent successfully'
        };
    } catch (error) {
        console.error('Real email sending failed:', error);
        // Fallback to development mode
        console.log('⚠️ Falling back to development mode...');
        return await sendPasswordResetEmail(email, resetUrl);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        console.log('=== WELCOME EMAIL (Development Mode) ===');
        console.log('To:', email);
        console.log('Subject: Welcome to Library Management System');
        console.log('Name:', name);
        console.log('==========================================');
        
        return {
            success: true,
            message: 'Welcome email sent successfully (development mode)'
        };
    } catch (error) {
        console.error('Email service error:', error);
        return {
            success: false,
            message: 'Failed to send welcome email'
        };
    }
};
