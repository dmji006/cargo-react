-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  seats INT NOT NULL,
  fuel_type ENUM('Gasoline', 'Diesel', 'Electric', 'Hybrid') NOT NULL,
  transmission ENUM('Automatic', 'Manual', 'CVT') NOT NULL,
  description TEXT NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create car_images table
CREATE TABLE IF NOT EXISTS car_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  car_id INT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX idx_cars_user_id ON cars(user_id);
CREATE INDEX idx_car_images_car_id ON car_images(car_id); 