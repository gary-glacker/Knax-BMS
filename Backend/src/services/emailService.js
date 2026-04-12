// services/emailService.js
const transporter = require('../config/email');

/**
 * Send password reset code email
 * @param {string} toEmail - Recipient email address
 * @param {string} resetCode - 6-digit reset code
 * @param {string} username - User's name (optional)
 */
async function sendPasswordResetEmail(toEmail, resetCode, username = '') {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 30px;
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            text-align: center;
            padding: 20px;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            letter-spacing: 5px;
            font-family: monospace;
          }
          .warning {
            color: #e74c3c;
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${username || 'User'},</p>
            <p>We received a request to reset your password. Use the verification code below to proceed:</p>
            
            <div class="code">
              ${resetCode}
            </div>
            
            <p>This code will expire in <strong>15 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
            
            <div class="warning">
              ⚠️ Never share this code with anyone. Our support team will never ask for it.
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} KBMS Powered By <a href="https://github.com/gary-glacker">Jean Marie GATARE</a>. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      Password Reset Request
      
      Hello ${username || 'User'},
      
      We received a request to reset your password. Use the verification code below:
      
      ${resetCode}
      
      This code will expire in 15 minutes.
      
      If you didn't request this, please ignore this email.
      
      ⚠️ Never share this code with anyone.
      
      ---
      This is an automated message, please do not reply to this email.
    `;

    const mailOptions = {
      from: `"KBMS" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Password Reset Code - KBMS',
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Reset code sent to ${toEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send password changed confirmation email
 */
async function sendPasswordChangedEmail(toEmail, username = '') {
  try {
    const mailOptions = {
      from: `"KBMS" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Your Password Has Been Changed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Password Changed Successfully</h2>
          <p>Hello ${username || 'User'},</p>
          <p>Your password has been successfully changed.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
          <hr />
          <small>This is an automated message, please do not reply.</small>
        </div>
      `,
      text: `Password Changed Successfully\n\nHello ${username || 'User'},\n\nYour password has been successfully changed.\n\nIf you did not perform this action, please contact our support team immediately.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password change confirmation sent to ${toEmail}`);
    return { success: true };
    
  } catch (error) {
    console.error('Confirmation email failed:', error);
    // Don't throw - confirmation email is optional
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};