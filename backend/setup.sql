-- -----------------------------------------------------
-- Schema smart_scheduling
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `smart_scheduling` DEFAULT CHARACTER SET utf8mb4 ;
USE `smart_scheduling` ;

-- -----------------------------------------------------
-- Table `machines`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `machines` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `status` ENUM('Idle', 'Running', 'Maintenance') DEFAULT 'Idle',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `workers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `skill` VARCHAR(50) NOT NULL,
  `status` ENUM('Available', 'Busy', 'Off-duty') DEFAULT 'Available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `priority` INT NOT NULL DEFAULT 1, -- 1(Low), 2(Medium), 3(High)
  `machine_type_required` VARCHAR(50) NOT NULL,
  `skill_required` VARCHAR(50) NOT NULL,
  `duration_hours` INT NOT NULL,
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Delayed') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- -----------------------------------------------------
-- Table `schedules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `job_id` INT NOT NULL,
  `machine_id` INT DEFAULT NULL,
  `worker_id` INT DEFAULT NULL,
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`machine_id`) REFERENCES `machines`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`worker_id`) REFERENCES `workers`(`id`) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Insert Dummy Data for Testing
-- -----------------------------------------------------
INSERT INTO `machines` (`name`, `type`, `status`) VALUES
('CNC Lathe Alpha', 'CNC', 'Idle'),
('Milling Station V2', 'Milling', 'Idle'),
('Welding Robot-X', 'Welding', 'Idle');

INSERT INTO `workers` (`name`, `skill`, `status`) VALUES
('Alice Johnson', 'CNC', 'Available'),
('Bob Smith', 'Welding', 'Available'),
('Charlie Davis', 'Milling', 'Available');

INSERT INTO `jobs` (`name`, `priority`, `machine_type_required`, `skill_required`, `duration_hours`, `status`) VALUES
('Engine Block Form', 3, 'CNC', 'CNC', 4, 'Pending'),
('Chassis Welding', 2, 'Welding', 'Welding', 6, 'Pending'),
('Gear Milling', 1, 'Milling', 'Milling', 3, 'Pending'),
('Axle CNC Machining', 2, 'CNC', 'CNC', 5, 'Pending');
