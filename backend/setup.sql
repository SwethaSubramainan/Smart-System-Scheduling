-- -----------------------------------------------------
-- Database: smart_scheduling (PostgreSQL)
-- -----------------------------------------------------
-- Run: CREATE DATABASE smart_scheduling; before executing this script
-- Then connect to it: \c smart_scheduling

-- -----------------------------------------------------
-- Table machines
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS machines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Idle' CHECK (status IN ('Idle', 'Running', 'Maintenance')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table workers
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS workers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  skill VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Busy', 'Off-duty')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table jobs
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  priority INT NOT NULL DEFAULT 1, -- 1(Low), 2(Medium), 3(High)
  machine_type_required VARCHAR(50) NOT NULL,
  skill_required VARCHAR(50) NOT NULL,
  duration_hours INT NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Delayed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table schedules
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  machine_id INT DEFAULT NULL REFERENCES machines(id) ON DELETE SET NULL,
  worker_id INT DEFAULT NULL REFERENCES workers(id) ON DELETE SET NULL,
  start_time TIMESTAMP DEFAULT NULL,
  end_time TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Insert Dummy Data for Testing
-- -----------------------------------------------------
INSERT INTO machines (name, type, status) VALUES
('CNC Lathe Alpha', 'CNC', 'Idle'),
('Milling Station V2', 'Milling', 'Idle'),
('Welding Robot-X', 'Welding', 'Idle'),
('CNC Precision Pro', 'CNC', 'Idle'),
('Assembly Line A1', 'Assembly', 'Idle'),
('Assembly Line A2', 'Assembly', 'Running'),
('Lathe Turner-500', 'Lathe', 'Idle'),
('Lathe Turner-700', 'Lathe', 'Maintenance'),
('Welding ArcBot-Z', 'Welding', 'Idle'),
('Milling CenterX', 'Milling', 'Running');

INSERT INTO workers (name, skill, status) VALUES
('Alice Johnson', 'CNC', 'Available'),
('Bob Smith', 'Welding', 'Available'),
('Charlie Davis', 'Milling', 'Available'),
('Diana Lopez', 'Assembly', 'Available'),
('Ethan Brown', 'CNC', 'Available'),
('Fatima Khan', 'Lathe', 'Available'),
('George Wilson', 'Welding', 'Busy'),
('Hannah Lee', 'Milling', 'Available'),
('Isaac Martin', 'Assembly', 'Off-duty'),
('Julia Chen', 'Lathe', 'Available'),
('Kevin Patel', 'CNC', 'Available'),
('Laura Adams', 'Welding', 'Available');

INSERT INTO jobs (name, priority, machine_type_required, skill_required, duration_hours, status) VALUES
('Engine Block Form', 3, 'CNC', 'CNC', 4, 'Pending'),
('Chassis Welding', 2, 'Welding', 'Welding', 6, 'Pending'),
('Gear Milling', 1, 'Milling', 'Milling', 3, 'Pending'),
('Axle CNC Machining', 2, 'CNC', 'CNC', 5, 'Pending'),
('Brake Disc Turning', 3, 'Lathe', 'Lathe', 3, 'Pending'),
('Dashboard Assembly', 2, 'Assembly', 'Assembly', 5, 'Pending'),
('Exhaust Pipe Welding', 3, 'Welding', 'Welding', 4, 'Pending'),
('Crankshaft Milling', 1, 'Milling', 'Milling', 6, 'Pending'),
('Piston CNC Finishing', 3, 'CNC', 'CNC', 2, 'Pending'),
('Door Panel Assembly', 2, 'Assembly', 'Assembly', 3, 'Pending'),
('Flywheel Lathe Work', 1, 'Lathe', 'Lathe', 4, 'Pending'),
('Frame Welding', 2, 'Welding', 'Welding', 7, 'Pending'),
('Camshaft Milling', 3, 'Milling', 'Milling', 3, 'Pending'),
('Cylinder Head CNC', 2, 'CNC', 'CNC', 5, 'Pending'),
('Suspension Assembly', 1, 'Assembly', 'Assembly', 4, 'Pending'),
('Rotor Disc Turning', 2, 'Lathe', 'Lathe', 2, 'Pending');
