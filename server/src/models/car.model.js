const pool = require('../config/db');

const Car = {
  // Create a new car listing
  create: async (carData) => {
    const [result] = await pool.execute(
      `INSERT INTO cars (
        user_id,
        brand,
        model,
        year,
        seats,
        fuel_type,
        transmission,
        description,
        price_per_day,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        carData.userId,
        carData.brand,
        carData.model,
        carData.year,
        carData.seats,
        carData.fuelType,
        carData.transmission,
        carData.description,
        carData.price,
      ]
    );
    return result.insertId;
  },

  // Add car images
  addImages: async (carId, imageUrls) => {
    const values = imageUrls.map(url => [carId, url]);
    const [result] = await pool.execute(
      'INSERT INTO car_images (car_id, image_url) VALUES ?',
      [values]
    );
    return result;
  },

  // Get all cars for a specific user
  getByUserId: async (userId) => {
    const [cars] = await pool.execute(
      `SELECT c.*, GROUP_CONCAT(ci.image_url) as images
       FROM cars c
       LEFT JOIN car_images ci ON c.id = ci.car_id
       WHERE c.user_id = ?
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return cars.map(car => ({
      ...car,
      images: car.images ? car.images.split(',') : []
    }));
  },

  // Get a single car by ID with its images
  getById: async (carId) => {
    const [cars] = await pool.execute(
      `SELECT c.*, GROUP_CONCAT(ci.image_url) as images
       FROM cars c
       LEFT JOIN car_images ci ON c.id = ci.car_id
       WHERE c.id = ?
       GROUP BY c.id`,
      [carId]
    );
    if (cars.length === 0) return null;
    const car = cars[0];
    return {
      ...car,
      images: car.images ? car.images.split(',') : []
    };
  },

  // Update car details
  update: async (carId, carData) => {
    const [result] = await pool.execute(
      `UPDATE cars
       SET brand = ?,
           model = ?,
           year = ?,
           seats = ?,
           fuel_type = ?,
           transmission = ?,
           description = ?,
           price_per_day = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        carData.brand,
        carData.model,
        carData.year,
        carData.seats,
        carData.fuelType,
        carData.transmission,
        carData.description,
        carData.price,
        carId
      ]
    );
    return result.affectedRows > 0;
  },

  // Delete car images
  deleteImages: async (carId) => {
    const [result] = await pool.execute(
      'DELETE FROM car_images WHERE car_id = ?',
      [carId]
    );
    return result;
  },

  // Delete a car
  delete: async (carId) => {
    // First delete related images
    await Car.deleteImages(carId);
    // Then delete the car
    const [result] = await pool.execute(
      'DELETE FROM cars WHERE id = ?',
      [carId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Car; 