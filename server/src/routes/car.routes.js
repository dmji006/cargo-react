const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');

// TODO: Add car controller functions
const carController = {
    listCars: async (req, res) => {
        try {
            res.json({ message: "Car listing route working" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

// Routes
router.get('/', carController.listCars);

module.exports = router; 