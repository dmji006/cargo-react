const Car = require('../models/car.model');

const carController = {
  // Create a new car listing
  createCar: async (req, res) => {
    try {
      const carData = {
        userId: req.user.id, // Assuming user info is added by auth middleware
        ...req.body
      };

      // Create car record
      const carId = await Car.create(carData);

      // Add images if provided
      if (req.body.images && req.body.images.length > 0) {
        await Car.addImages(carId, req.body.images);
      }

      // Get the created car with images
      const car = await Car.getById(carId);

      res.status(201).json({
        message: 'Car listed successfully',
        car
      });
    } catch (error) {
      console.error('Error creating car:', error);
      res.status(500).json({
        message: 'Failed to create car listing',
        error: error.message
      });
    }
  },

  // Get all cars for the logged-in user
  getUserCars: async (req, res) => {
    try {
      const cars = await Car.getByUserId(req.user.id);
      res.json(cars);
    } catch (error) {
      console.error('Error fetching user cars:', error);
      res.status(500).json({
        message: 'Failed to fetch cars',
        error: error.message
      });
    }
  },

  // Get a specific car by ID
  getCarById: async (req, res) => {
    try {
      const car = await Car.getById(req.params.id);
      if (!car) {
        return res.status(404).json({
          message: 'Car not found'
        });
      }
      res.json(car);
    } catch (error) {
      console.error('Error fetching car:', error);
      res.status(500).json({
        message: 'Failed to fetch car',
        error: error.message
      });
    }
  },

  // Update a car listing
  updateCar: async (req, res) => {
    try {
      const carId = req.params.id;
      const car = await Car.getById(carId);

      // Check if car exists and belongs to user
      if (!car) {
        return res.status(404).json({
          message: 'Car not found'
        });
      }
      if (car.user_id !== req.user.id) {
        return res.status(403).json({
          message: 'Not authorized to update this car'
        });
      }

      // Update car details
      await Car.update(carId, req.body);

      // Update images if provided
      if (req.body.images) {
        await Car.deleteImages(carId);
        if (req.body.images.length > 0) {
          await Car.addImages(carId, req.body.images);
        }
      }

      // Get updated car
      const updatedCar = await Car.getById(carId);
      res.json({
        message: 'Car updated successfully',
        car: updatedCar
      });
    } catch (error) {
      console.error('Error updating car:', error);
      res.status(500).json({
        message: 'Failed to update car',
        error: error.message
      });
    }
  },

  // Delete a car listing
  deleteCar: async (req, res) => {
    try {
      const carId = req.params.id;
      const car = await Car.getById(carId);

      // Check if car exists and belongs to user
      if (!car) {
        return res.status(404).json({
          message: 'Car not found'
        });
      }
      if (car.user_id !== req.user.id) {
        return res.status(403).json({
          message: 'Not authorized to delete this car'
        });
      }

      await Car.delete(carId);
      res.json({
        message: 'Car deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting car:', error);
      res.status(500).json({
        message: 'Failed to delete car',
        error: error.message
      });
    }
  }
};

module.exports = carController; 