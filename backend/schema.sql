-- 1. Create a brand new database with a different name
CREATE DATABASE IF NOT EXISTS welfare_core_system;
USE welfare_core_system;

-- 2. Citizens Table (Formerly IndividualBeneficiaries)
CREATE TABLE IF NOT EXISTS citizens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    aadhaar_no VARCHAR(12) UNIQUE,
    income DECIMAL(10,2),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Schemes Table (Formerly WelfareSchemes)
CREATE TABLE IF NOT EXISTS schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(250) UNIQUE NOT NULL,
    description TEXT,
    max_income DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Applications Table (Formerly CurrentApplications)
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id INT,
    scheme_id INT,
    status VARCHAR(50) DEFAULT 'Pending eKYC',
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
);

-- Insert some dummy data so we have something to test later!
INSERT INTO schemes (scheme_name, description, max_income) 
VALUES 
('Education Scholarship 2026', 'Financial aid for higher education students', 200000.00),
('Senior Citizen Pension', 'Monthly DBT for citizens above 60 years', 100000.00);