const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const validator = require('validator'); // Import validator
require('dotenv').config(); // Load environment variables
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// API route to handle form submission
app.post('/api/callback', (req, res) => {
    const { name, phone, location, message } = req.body;

    // Validate inputs using validator library
    if (!name || validator.isEmpty(name.trim())) {
        return res.status(400).send({ error: 'Name is required and cannot be empty.' });
    }

    if (!phone || !validator.isMobilePhone(phone, 'any')) {
        return res.status(400).send({ error: 'A valid phone number is required.' });
    }

    if (!location || validator.isEmpty(location.trim())) {
        return res.status(400).send({ error: 'Location is required and cannot be empty.' });
    }

    if (message && message.length > 500) {
        return res.status(400).send({ error: 'Message cannot exceed 500 characters.' });
    }

    // Configure the email transporter using SMTP
    const transporter = nodemailer.createTransport({
        host: 'mail.gobapay.com', // SMTP server for GobaPay
        port: 587, // Port for TLS
        secure: false, // Set to true if using port 465 for SSL
        auth: {
            user: process.env.EMAIL_USER, // Email from .env file
            pass: process.env.EMAIL_PASS // Password from .env file
        }
    });

    // Define multiple recipient emails as an array
    const recipients = ['vivimarny@gmail.com', 'onyeweketerence@gmail.com']; // Add more emails if needed

    // Define the email content
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to: recipients.join(','), // Join array into comma-separated string
        subject: 'New Callback Request',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #333;">New Callback Request</h2>
                <p style="color: #555;">You have received a new callback request with the following details:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Location:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${location}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${message || 'No message provided.'}</td>
                    </tr>
                </table>
                <p style="color: #555;">Please contact the user at your earliest convenience.</p>
            </div>
        `
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send({ error: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
