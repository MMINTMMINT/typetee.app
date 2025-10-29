// Email sending utility using basic approach
// In production, consider using services like Resend, SendGrid, or AWS SES

interface EmailData {
  email: string
  name: string
  orderId: string
  printifyOrderId: string
  design: {
    mode: string
    text: string
    asciiArt: string
    font: string
    placement: string
  }
  shirtColor: string
  size: string
}

export async function sendOrderConfirmationEmail(data: EmailData) {
  // Generate retro terminal-style HTML email
  const htmlContent = generateRetroEmailHTML(data)
  
  // In a real implementation, you would send this via your email service
  // For now, we'll log it (you'll need to configure an email service)
  console.log('Sending order confirmation email to:', data.email)
  console.log('Order ID:', data.orderId)
  
  // Example with nodemailer (uncomment and configure when ready):
  /*
  const nodemailer = require('nodemailer')
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
  
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: data.email,
    subject: `Order Confirmation - ${data.orderId}`,
    html: htmlContent,
  })
  */
  
  return true
}

function generateRetroEmailHTML(data: EmailData): string {
  const bgColor = '#000000'
  const textColor = '#00FF00' // Terminal green
  const borderColor = '#00FF00'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'VT323', monospace;
          background-color: #1a1a1a;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${bgColor};
          color: ${textColor};
          border: 4px solid ${borderColor};
          padding: 20px;
        }
        .header {
          text-align: center;
          font-size: 32px;
          margin-bottom: 20px;
          border-bottom: 2px solid ${borderColor};
          padding-bottom: 10px;
        }
        .blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .section {
          margin: 20px 0;
          border: 2px solid ${borderColor};
          padding: 15px;
        }
        .label {
          font-weight: bold;
          margin-right: 10px;
        }
        .value {
          color: #FFFFFF;
        }
        pre {
          background-color: #000;
          padding: 10px;
          overflow-x: auto;
          font-size: 12px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid ${borderColor};
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          > TYPETEE.APP<span class="blink">_</span>
        </div>
        
        <div class="section">
          <p>> ORDER CONFIRMED</p>
          <p><span class="label">ORDER ID:</span> <span class="value">${data.orderId}</span></p>
          <p><span class="label">CUSTOMER:</span> <span class="value">${data.name}</span></p>
          <p><span class="label">EMAIL:</span> <span class="value">${data.email}</span></p>
        </div>
        
        <div class="section">
          <p>> PRODUCT DETAILS</p>
          <p><span class="label">ITEM:</span> <span class="value">Custom ${data.shirtColor.toUpperCase()} T-Shirt</span></p>
          <p><span class="label">SIZE:</span> <span class="value">${data.size}</span></p>
          <p><span class="label">DESIGN TYPE:</span> <span class="value">${data.design.mode.toUpperCase()}</span></p>
          <p><span class="label">PLACEMENT:</span> <span class="value">${data.design.placement.toUpperCase()}</span></p>
        </div>
        
        <div class="section">
          <p>> DESIGN PREVIEW</p>
          ${data.design.mode === 'text' 
            ? `<p class="value">${data.design.text}</p>` 
            : `<pre>${data.design.asciiArt.substring(0, 500)}${data.design.asciiArt.length > 500 ? '...' : ''}</pre>`
          }
        </div>
        
        <div class="section">
          <p>> SHIPPING INFO</p>
          <p>Your order has been sent to production.</p>
          <p>You will receive a shipping notification when your order ships.</p>
          <p>Estimated delivery: 7-14 business days</p>
        </div>
        
        <div class="footer">
          <p>> THANK YOU FOR YOUR ORDER <span class="blink">█</span></p>
          <p style="font-size: 12px; opacity: 0.7;">
            Questions? Contact us at support@typetee.app
          </p>
          <p style="font-size: 12px; opacity: 0.7;">
            © 2025 TYPETEE.APP - All Rights Reserved
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
