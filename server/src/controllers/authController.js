const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/database');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
    // Sign up with phone number
    signup: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { phone, password, name, email, address, drivers_license_url, license_number } = req.body;

            // Check if user already exists
            const [existingUser] = await db.query(
                'SELECT * FROM users WHERE mobile_number = ? OR email = ? OR license_number = ?',
                [phone, email, license_number]
            );
            
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'User already exists with this phone, email, or license number' });
            }

            // Generate OTP
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

            // Store OTP in database
            await db.query(
                'INSERT INTO phone_verifications (mobile_number, verification_code, expires_at) VALUES (?, ?, ?)',
                [phone, otp, expiresAt]
            );

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Store user data temporarily
            const tempUserData = {
                phone,
                password: hashedPassword,
                name,
                email,
                address,
                drivers_license_url,
                license_number
            };

            // For development, log the OTP
            console.log(`OTP for ${phone}: ${otp}`);

            res.status(200).json({
                message: 'OTP generated successfully',
                phone,
                tempUserData
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Verify OTP and complete signup
    verifyOTP: async (req, res) => {
        try {
            const { phone, otp } = req.body;
            
            // Get the latest unused OTP for this phone number
            const [verifications] = await db.query(
                'SELECT * FROM phone_verifications WHERE mobile_number = ? AND verification_code = ? AND used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
                [phone, otp]
            );

            if (verifications.length === 0) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }

            // Mark OTP as used
            await db.query(
                'UPDATE phone_verifications SET used = TRUE WHERE id = ?',
                [verifications[0].id]
            );

            // Create user in database
            const [result] = await db.query(
                'INSERT INTO users (name, email, mobile_number, address, password, drivers_license_url, license_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    req.body.tempUserData.name,
                    req.body.tempUserData.email,
                    req.body.tempUserData.phone,
                    req.body.tempUserData.address,
                    req.body.tempUserData.password,
                    req.body.tempUserData.drivers_license_url,
                    req.body.tempUserData.license_number
                ]
            );

            // Generate JWT token
            const token = jwt.sign(
                { userId: result.insertId },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token
            });
        } catch (error) {
            console.error('OTP verification error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Login
    login: async (req, res) => {
        try {
            const { phone, password } = req.body;

            // Check if user exists
            const [users] = await db.query('SELECT * FROM users WHERE mobile_number = ?', [phone]);
            if (users.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const user = users[0];

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.mobile_number,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = authController; 