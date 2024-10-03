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

// Function to configure the email transporter using SMTP
const configureTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // SMTP server for GobaPay
        port: 587, // Port for TLS
        secure: false, // Set to true if using port 465 for SSL
        auth: {
            user: process.env.EMAIL_USER, // Email from .env file
            pass: process.env.EMAIL_PASS // Password from .env file
        }
    });
};

// Function to send email
const sendEmail = (mailOptions, res) => {
    const transporter = configureTransporter();

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send({ error: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send({ message: 'Email sent successfully' });
        }
    });
};

// API route to handle Request callback
app.post('/api/callback', (req, res) => {
    const { name, phone, callTime, location, message } = req.body;

    // Validate inputs using validator library
    if (!name || validator.isEmpty(name.trim())) {
        return res.status(400).send({ error: 'Name is required and cannot be empty.' });
    }

    if (!phone || !validator.isMobilePhone(phone, 'any')) {
        return res.status(400).send({ error: 'A valid phone number is required.' });
    }

    if (!callTime || validator.isEmpty(callTime)) {
        return res.status(400).send({ error: 'Date and Time of call is required' });
    }

    if (!location || validator.isEmpty(location.trim())) {
        return res.status(400).send({ error: 'Location is required and cannot be empty.' });
    }

    if (message && message.length > 500) {
        return res.status(400).send({ error: 'Message cannot exceed 500 characters.' });
    }

    // Define multiple recipient emails as an array
    const recipients = ['vivimarny@gmail.com', 'onyeweketerence@gmail.com'];

    // Define the email content for callback request
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
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Call Time:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${callTime}</td>
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
    sendEmail(mailOptions, res);
});

// API route to handle Request Proposal
app.post('/api/proposal', (req, res) => {
    const { name, phone, email, businessName, businessCategory, location, message } = req.body;

    // Validate inputs using validator library
    if (!name || validator.isEmpty(name.trim())) {
        return res.status(400).send({ error: 'Name is required and cannot be empty.' });
    }

    if (!phone || !validator.isMobilePhone(phone, 'any')) {
        return res.status(400).send({ error: 'A valid phone number is required.' });
    }

    if (!email || !validator.isEmail(email)) {
        return res.status(400).send({ error: 'A valid email address is required.' });
    }

    if (!businessName || validator.isEmpty(businessName.trim())) {
        return res.status(400).send({ error: 'Business name is required and cannot be empty.' });
    }

    if (!businessCategory || validator.isEmpty(businessCategory.trim())) {
        return res.status(400).send({ error: 'Business category is required and cannot be empty.' });
    }

    if (!location || validator.isEmpty(location.trim())) {
        return res.status(400).send({ error: 'Location is required and cannot be empty.' });
    }

    if (message && message.length > 500) {
        return res.status(400).send({ error: 'Message cannot exceed 500 characters.' });
    }

    // Define multiple recipient emails as an array
    const recipients = ['vivimarny@gmail.com', 'onyeweketerence@gmail.com'];

    // Define the email content for proposal request
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to: recipients.join(','), // Join array into comma-separated string
        subject: 'New Proposal Request',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #333;">New Proposal Request</h2>
                <p style="color: #555;">You have received a new proposal request with the following details:</p>
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
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business Name:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${businessName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business Category:</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${businessCategory}</td>
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
    sendEmail(mailOptions, res);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
