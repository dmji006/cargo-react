const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');

// Registration validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('mobileNumber')
    .matches(/^(09|\+639)\d{9}$/)
    .withMessage('Please enter a valid Philippine mobile number'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Phone verification validation rules
const phoneVerificationValidation = [
  body('mobileNumber')
    .matches(/^(09|\+639)\d{9}$/)
    .withMessage('Please enter a valid Philippine mobile number'),
];

const verifyPhoneValidation = [
  body('token').notEmpty().withMessage('Token is required'),
  body('verificationCode')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Please enter a valid 6-digit verification code'),
];

// Routes
router.post(
  '/register',
  upload.fields([
    { name: 'driversLicenseFront', maxCount: 1 },
    { name: 'driversLicenseBack', maxCount: 1 }
  ]),
  registerValidation,
  validate,
  authController.register
);

router.post('/login', authController.login);

// Phone verification routes
router.post(
  '/send-verification',
  phoneVerificationValidation,
  validate,
  authController.sendPhoneVerification
);

router.post(
  '/verify-phone',
  verifyPhoneValidation,
  validate,
  authController.verifyPhone
);

module.exports = router; 