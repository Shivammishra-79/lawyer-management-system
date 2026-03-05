-- 1. DATABASE SETUP
CREATE DATABASE IF NOT EXISTS lawdb;
USE lawdb;

-- 2. ADMIN TABLE
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255)
);

-- 3. APPOINTMENTS TABLE (Verified with your CSV)
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    date DATE,
    time TIME,
    status VARCHAR(50), -- Aapki file mein ye extra column hai
    fee FLOAT DEFAULT 0,
    gst FLOAT DEFAULT 18,
    total DECIMAL(10,2),
    address VARCHAR(255) DEFAULT '',
    problem TEXT,
    solution TEXT
);

-- 4. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reason VARCHAR(255) NOT NULL,
    amount FLOAT NOT NULL,
    date DATE
);

-- 5. CLIENT_INCOME TABLE
CREATE TABLE IF NOT EXISTS client_income (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255),
    mobile_number VARCHAR(15),
    amount DOUBLE,
    payment_date DATE
);

-- 6. SERVICES TABLE (Verified Structure)
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),        -- 'service_name' ki jagah 'title' hai
    description TEXT,          -- Ye naya field hai
    charge DECIMAL(10,2)
);

-- 7. BLOGS TABLE
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT
);