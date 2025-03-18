const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Create a new car listing
router.post('/', carController.createCar);

// Get all cars for the logged-in user
router.get('/my-cars', carController.getUserCars);

// Get a specific car by ID
router.get('/:id', carController.getCarById);

// Update a car listing
router.put('/:id', carController.updateCar);

// Delete a car listing
router.delete('/:id', carController.deleteCar);

module.exports = router; 