const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { isValidLicenseFormat } = require('../models/license.validation');

const register = async (req, res) => {
  try {
    const { name, email, mobileNumber, address, password, licenseNumber } = req.body;
    const driversLicenseFront = req.files?.driversLicenseFront?.[0];
    const driversLicenseBack = req.files?.driversLicenseBack?.[0];

    if (!driversLicenseFront || !driversLicenseBack) {
      return res.status(400).json({
        success: false,
        message: "Both front and back images of driver's license are required"
      });
    }

    // Validate license number format
    if (!isValidLicenseFormat(licenseNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid license number format. Must be in format C09-10-XXXXXX where X is a digit"
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE mobile_number = ? OR license_number = ? OR email = ?',
      [mobileNumber, licenseNumber, email]
    );

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.mobile_number === mobileNumber) {
        return res.status(400).json({
          success: false,
          message: 'User with this mobile number already exists'
        });
      }
      if (existingUser.license_number === licenseNumber) {
        return res.status(400).json({
          success: false,
          message: "This driver's license is already registered"
        });
      }
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: "This email is already registered"
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Combine both image paths
    const driversLicenseUrls = {
      front: driversLicenseFront.filename,
      back: driversLicenseBack.filename
    };

    // Save user to database
    const [result] = await pool.query(
      `INSERT INTO users (name, email, mobile_number, address, password, drivers_license_url, license_number, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, mobileNumber, address, hashedPassword, JSON.stringify(driversLicenseUrls), licenseNumber, 'user']
    );

    // Get the created user
    const [users] = await pool.query(
      'SELECT id, name, email, mobile_number, address, drivers_license_url, license_number, role FROM users WHERE id = ?',
      [result.insertId]
    );
    const user = users[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobile_number,
          address: user.address,
          driversLicenseUrl: JSON.parse(user.drivers_license_url),
          licenseNumber: user.license_number,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
};

const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE mobile_number = ?',
      [mobileNumber]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Log the user object before sending response
    console.log('User data being sent:', {
      id: user.id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobile_number,
      address: user.address,
      driversLicenseUrl: user.drivers_license_url ? JSON.parse(user.drivers_license_url) : null,
      licenseNumber: user.license_number,
      role: user.role
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobile_number,
          address: user.address,
          driversLicenseUrl: user.drivers_license_url ? JSON.parse(user.drivers_license_url) : null,
          licenseNumber: user.license_number,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
};

// Generate a random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code (you'll need to implement actual SMS sending)
const sendVerificationCode = async (phoneNumber, code) => {
  // TODO: Implement actual SMS sending logic here
  console.log(`Verification code ${code} would be sent to ${phoneNumber}`);
  return true;
};

const sendPhoneVerification = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Validate phone number format (Philippine format)
    if (!mobileNumber.match(/^(09|\+639)\d{9}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create JWT token containing the verification code
    const token = jwt.sign(
      { 
        mobileNumber,
        verificationCode
      },
      process.env.JWT_SECRET,
      { expiresIn: '10m' } // Token expires in 10 minutes
    );

    // Store verification attempt in database
    await pool.query(
      'INSERT INTO phone_verifications (mobile_number, verification_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [mobileNumber, verificationCode]
    );

    // Send verification code via SMS
    await sendVerificationCode(mobileNumber, verificationCode);

    res.json({
      success: true,
      message: 'Verification code sent successfully',
      token
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification code'
    });
  }
};

const verifyPhone = async (req, res) => {
  try {
    const { token, verificationCode } = req.body;

    if (!token || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Token and verification code are required'
      });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the verification code matches
    if (decoded.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Check if the code is still valid in the database
    const [verifications] = await pool.query(
      'SELECT * FROM phone_verifications WHERE mobile_number = ? AND verification_code = ? AND expires_at > NOW() AND used = 0 ORDER BY created_at DESC LIMIT 1',
      [decoded.mobileNumber, verificationCode]
    );

    if (verifications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Verification code expired or already used'
      });
    }

    // Mark verification code as used
    await pool.query(
      'UPDATE phone_verifications SET used = 1 WHERE id = ?',
      [verifications[0].id]
    );

    // Generate a new token indicating the phone is verified
    const verifiedToken = jwt.sign(
      { 
        mobileNumber: decoded.mobileNumber,
        verified: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      token: verifiedToken
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying phone number'
    });
  }
};

module.exports = {
  register,
  login,
  sendPhoneVerification,
  verifyPhone
}; 