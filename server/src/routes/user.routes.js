const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth.middleware');

// Validation rules for profile update
const updateProfileValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('mobileNumber')
    .matches(/^(09|\+639)\d{9}$/)
    .withMessage('Please enter a valid Philippine mobile number'),
  body('address').trim().notEmpty().withMessage('Address is required'),
];

// TODO: Add user controller functions
const userController = {
    getProfile: async (req, res) => {
        try {
            const [users] = await pool.query(
                'SELECT id, name, email, mobile_number as mobileNumber, address, drivers_license_url as driversLicenseUrl, license_number as licenseNumber, role FROM users WHERE id = ?',
                [req.user.userId]
            );

            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = users[0];
            if (user.driversLicenseUrl) {
                user.driversLicenseUrl = JSON.parse(user.driversLicenseUrl);
            }

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                address: user.address,
                driversLicenseUrl: user.driversLicenseUrl,
                licenseNumber: user.licenseNumber,
                role: user.role
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { name, email, mobileNumber, address } = req.body;

            // Check if mobile number is already taken by another user
            const [existingUsers] = await pool.query(
                'SELECT id FROM users WHERE mobile_number = ? AND id != ?',
                [mobileNumber, req.user.userId]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    message: 'Mobile number is already registered to another user'
                });
            }

            // Update user profile
            await pool.query(
                `UPDATE users 
                 SET name = ?, email = ?, mobile_number = ?, address = ?
                 WHERE id = ?`,
                [name, email, mobileNumber, address, req.user.userId]
            );

            // Get updated user data
            const [users] = await pool.query(
                'SELECT id, name, email, mobile_number as mobileNumber, address, drivers_license_url as driversLicenseUrl, license_number as licenseNumber, role FROM users WHERE id = ?',
                [req.user.userId]
            );

            const updatedUser = users[0];
            if (updatedUser.driversLicenseUrl) {
                updatedUser.driversLicenseUrl = JSON.parse(updatedUser.driversLicenseUrl);
            }

            res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobileNumber: updatedUser.mobileNumber,
                address: updatedUser.address,
                driversLicenseUrl: updatedUser.driversLicenseUrl,
                licenseNumber: updatedUser.licenseNumber,
                role: updatedUser.role
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

// Routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, validate, userController.updateProfile);

module.exports = router; 