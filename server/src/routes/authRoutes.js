const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation middleware
const signupValidation = [
    body('phone')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('address')
        .notEmpty()
        .withMessage('Address is required'),
    body('drivers_license_url')
        .notEmpty()
        .withMessage('Driver\'s license URL is required'),
    body('license_number')
        .matches(/^[A-Z0-9]{5,15}$/)
        .withMessage('License number must be 5-15 characters long and contain only uppercase letters and numbers')
];

const otpValidation = [
    body('phone')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    body('otp')
        .matches(/^[0-9]{6}$/)
        .withMessage('OTP must be 6 digits')
];

const loginValidation = [
    body('phone')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, authController.signup);
router.post('/verify-otp', otpValidation, authController.verifyOTP);
router.post('/login', loginValidation, authController.login);

module.exports = router; 