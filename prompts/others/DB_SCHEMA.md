# Database Schema — welfare_system

## Setup Commands
Run this in MySQL Workbench or terminal:
```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `welfare_system`;
CREATE DATABASE `welfare_system`;
USE `welfare_system`;

CREATE TABLE admins (
  AdminID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100),
  Email VARCHAR(100) UNIQUE,
  Password VARCHAR(255)
);

CREATE TABLE officers (
  OfficerID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100),
  Email VARCHAR(100) UNIQUE,
  Department VARCHAR(100),
  Status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE individualbeneficiaries (
  BeneficiaryID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100),
  Email VARCHAR(100) UNIQUE,
  Aadhaar VARCHAR(12) UNIQUE,
  Income DECIMAL(10,2),
  Category VARCHAR(50)
);

CREATE TABLE welfareschemes (
  SchemeID INT AUTO_INCREMENT PRIMARY KEY,
  SchemeName VARCHAR(100) UNIQUE,
  Description TEXT,
  isactive TINYINT(1) DEFAULT 0,
  max_income INT DEFAULT 0
);

CREATE TABLE currentapplications (
  RecordID INT AUTO_INCREMENT PRIMARY KEY,
  BeneficiaryID INT,
  SchemeID INT,
  OfficerID INT,
  Applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Status VARCHAR(30) DEFAULT 'Pending',
  FOREIGN KEY (BeneficiaryID) 
    REFERENCES individualbeneficiaries(BeneficiaryID),
  FOREIGN KEY (SchemeID) 
    REFERENCES welfareschemes(SchemeID),
  FOREIGN KEY (OfficerID) 
    REFERENCES officers(OfficerID)
);

CREATE TABLE auditlogs (
  LogID INT AUTO_INCREMENT PRIMARY KEY,
  ActorType VARCHAR(20),
  ActionDetails TEXT,
  ActionTime DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (Name, Email, Password) VALUES
  ('System Admin', 'admin@govt.in', 'password123');

INSERT INTO officers (Name, Email, Department) VALUES
  ('Aarti Sharma', 'aarti@govt.in', 'Healthcare');

INSERT INTO individualbeneficiaries 
  (Name, Email, Aadhaar, Income, Category) VALUES
  ('John Doe', 'john@example.com', 
   '123456789012', 45000, 'General');

INSERT INTO welfareschemes 
  (SchemeName, Description, isactive, max_income) VALUES
  ('National Health Grant', 
   'Financial aid for medical expenses.', 1, 50000),
  ('Education Scholarship', 
   'Support for higher studies.', 0, 100000);

SET FOREIGN_KEY_CHECKS = 1;
```

## Table Relationships
- currentapplications.BeneficiaryID → individualbeneficiaries
- currentapplications.SchemeID → welfareschemes
- currentapplications.OfficerID → officers
- auditlogs has no foreign keys (standalone log)

## Key Fields to Remember
- welfareschemes.isactive: 0=inactive, 1=active
- welfareschemes.max_income: eligibility ceiling
- currentapplications.Status: 
  'Pending' | 'Under Review' | 'Approved' | 'Rejected'
- officers.Status: 'Active' | 'Suspended'