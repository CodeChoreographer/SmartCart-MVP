CREATE DATABASE IF NOT EXISTS smartcart;
USE smartcart;

CREATE TABLE IF NOT EXISTS users (
                                   id INT PRIMARY KEY AUTO_INCREMENT,
                                   firstName VARCHAR(255) NOT NULL,
                                   lastName VARCHAR(255) NOT NULL,
                                   email VARCHAR(255) UNIQUE NOT NULL,
                                   gender VARCHAR(50) NOT NULL,
                                   password VARCHAR(255) NOT NULL,
                                   isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inventory (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       name VARCHAR(255) NOT NULL,
                                       quantity INT NOT NULL,
                                       unit VARCHAR(50) NOT NULL,
                                       userId INT NOT NULL,
                                       FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
