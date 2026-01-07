import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'macssrealestate@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'kqwc hynh bhdj vace',
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"MAC SS Real Estate" <macssrealestate@gmail.com>`,
      to,
      subject,
      html,
      replyTo: replyTo || 'macssrealestate@gmail.com',
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Email template for property inquiry
export function createPropertyInquiryEmail(data: {
  propertyTitle: string;
  propertyId: string;
  propertyImage?: string;
  propertyPrice?: string;
  propertyLocation?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  propertyUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #1f2937;
          background-color: #f3f4f6;
          padding: 20px;
        }
        .email-wrapper { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          color: white;
          font-size: 26px;
          font-weight: 700;
          margin: 0;
        }
        .property-card {
          margin: 24px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .property-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          display: block;
        }
        .property-info {
          padding: 20px;
          background: #f9fafb;
        }
        .property-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 8px;
        }
        .property-details {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .detail-item {
          font-size: 14px;
          color: #6b7280;
        }
        .detail-item strong {
          color: #374151;
        }
        .content { 
          padding: 24px;
        }
        .section {
          margin-bottom: 28px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #3b82f6;
        }
        .info-grid {
          display: grid;
          gap: 12px;
        }
        .info-row { 
          padding: 12px 16px;
          background: #f9fafb;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
        }
        .label { 
          font-weight: 600;
          color: #6b7280;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 4px;
        }
        .value {
          color: #1f2937;
          font-size: 15px;
        }
        .value a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        .value a:hover {
          text-decoration: underline;
        }
        .message-box {
          background: #f9fafb;
          padding: 20px;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
          font-size: 15px;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white; 
          padding: 14px 32px; 
          text-decoration: none; 
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
          transition: all 0.3s;
        }
        .button:hover {
          box-shadow: 0 6px 8px rgba(59, 130, 246, 0.4);
        }
        .footer { 
          padding: 24px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        .footer-text {
          color: #6b7280; 
          font-size: 14px;
          margin: 4px 0;
        }
        .footer-brand {
          color: #1e40af;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper { border-radius: 0; }
          .property-details { flex-direction: column; gap: 8px; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>🏠 New Property Inquiry</h1>
        </div>
        
        ${data.propertyImage ? `
        <div class="property-card">
          <img src="${data.propertyImage}" alt="${data.propertyTitle}" class="property-image">
          <div class="property-info">
            <div class="property-title">${data.propertyTitle}</div>
            <div class="property-details">
              ${data.propertyPrice ? `<div class="detail-item"><strong>Price:</strong> ${data.propertyPrice}</div>` : ''}
              ${data.propertyLocation ? `<div class="detail-item"><strong>Location:</strong> ${data.propertyLocation}</div>` : ''}
              <div class="detail-item"><strong>ID:</strong> ${data.propertyId}</div>
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="content">
          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="info-grid">
              <div class="info-row">
                <span class="label">Full Name</span>
                <span class="value">${data.customerName}</span>
              </div>
              <div class="info-row">
                <span class="label">Email Address</span>
                <span class="value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></span>
              </div>
              <div class="info-row">
                <span class="label">Phone Number</span>
                <span class="value"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Customer Message</div>
            <div class="message-box">${data.message}</div>
          </div>

          <div class="button-container">
            <a href="${data.propertyUrl}" class="button">View Full Property Details →</a>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-top: 24px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⏰ Action Required:</strong> Please respond to this inquiry within 24 hours for best customer experience.
            </p>
          </div>
        </div>

        <div class="footer">
          <div class="footer-brand">MAC SS Real Estate Rwanda</div>
          <p class="footer-text">Professional Property Management</p>
          <p class="footer-text" style="margin-top: 12px;">
            📞 +250788308043 | 📧 macssrealestate@gmail.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email template for customer confirmation
export function createCustomerConfirmationEmail(data: {
  customerName: string;
  propertyTitle: string;
  propertyUrl: string;
  propertyImage?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #1f2937;
          background-color: #f3f4f6;
          padding: 20px;
        }
        .email-wrapper { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          color: white;
          font-size: 26px;
          font-weight: 700;
          margin: 0;
        }
        .content { 
          padding: 32px 24px;
        }
        .greeting {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .highlight-box {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          padding: 24px;
          border-left: 4px solid #3b82f6;
          border-radius: 8px;
          margin: 24px 0;
        }
        .highlight-box p {
          margin: 0;
          color: #1e40af;
          font-size: 16px;
          font-weight: 500;
        }
        ${data.propertyImage ? `
        .property-preview {
          margin: 24px 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .property-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        ` : ''}
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white; 
          padding: 14px 32px; 
          text-decoration: none; 
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }
        .contact-box {
          background: #f9fafb;
          padding: 24px;
          border-left: 4px solid #3b82f6;
          border-radius: 8px;
          margin: 24px 0;
        }
        .contact-box h3 {
          color: #1e40af;
          font-size: 16px;
          margin-bottom: 12px;
        }
        .contact-item {
          margin: 8px 0;
          font-size: 15px;
        }
        .contact-item strong {
          color: #374151;
          display: inline-block;
          min-width: 60px;
        }
        .footer { 
          padding: 24px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        .footer-brand {
          color: #1e40af;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .footer-text {
          color: #6b7280; 
          font-size: 14px;
          margin: 4px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>✅ Inquiry Received!</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Dear <strong>${data.customerName}</strong>,</p>
          
          <div class="highlight-box">
            <p>Thank you for your interest in <strong>${data.propertyTitle}</strong>!</p>
          </div>

          ${data.propertyImage ? `
          <div class="property-preview">
            <img src="${data.propertyImage}" alt="${data.propertyTitle}">
          </div>
          ` : ''}
          
          <p style="margin: 20px 0;">We have successfully received your inquiry. One of our experienced property specialists will contact you within <strong>24 hours</strong> to:</p>
          
          <ul style="margin: 16px 0 16px 24px; color: #374151;">
            <li style="margin: 8px 0;">Discuss the property details</li>
            <li style="margin: 8px 0;">Answer all your questions</li>
            <li style="margin: 8px 0;">Schedule a viewing if you're interested</li>
          </ul>

          <div class="button-container">
            <a href="${data.propertyUrl}" class="button">View Property Details →</a>
          </div>

          <div class="contact-box">
            <h3>Need Immediate Assistance?</h3>
            <div class="contact-item"><strong>Phone:</strong> +250788308043</div>
            <div class="contact-item"><strong>Email:</strong> macssrealestate@gmail.com</div>
            <div class="contact-item"><strong>Hours:</strong> Mon-Sat, 8:00 AM - 6:00 PM</div>
          </div>

          <p style="margin-top: 24px;">Best regards,<br>
          <strong style="color: #1e40af;">The MAC SS Real Estate Team</strong></p>
        </div>

        <div class="footer">
          <div class="footer-brand">MAC SS Real Estate Rwanda</div>
          <p class="footer-text">Your Trusted Partner in Finding the Perfect Property</p>
          <p class="footer-text" style="margin-top: 12px;">
            📞 +250788308043 | 📧 macssrealestate@gmail.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
