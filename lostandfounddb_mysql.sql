drop database LostandFoundDB;
CREATE DATABASE IF NOT EXISTS LostandFoundDB;
USE LostandFoundDB;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,    -- hashed password
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
  profile_picture LONGBLOB,  -- URL or file path for the profile picture
  user_type ENUM('User', 'Admin') DEFAULT 'User',  -- User role type
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,              -- user who posted the item
  -- category_id INT NULL,              -- optional category reference
  item_name VARCHAR(100) NOT NULL,
  item_type VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  status ENUM('lost','found','claimed','returned') DEFAULT 'lost',
  date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_path VARCHAR(255),

  CONSTRAINT fk_item_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE

   -- CONSTRAINT fk_item_category
   -- FOREIGN KEY (category_id) REFERENCES categories(category_id)
   -- ON DELETE SET NULL
   -- ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS claims (
  claim_id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  claimer_id INT NOT NULL,
  claim_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  claim_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_claim_item
    FOREIGN KEY (item_id) REFERENCES items(item_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_claim_user
    FOREIGN KEY (claimer_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  item_id INT NULL,
  subject VARCHAR(150),
  body TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,    -- 0 = unread, 1 = read
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_msg_sender
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_msg_recipient
    FOREIGN KEY (recipient_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_msg_item
    FOREIGN KEY (item_id) REFERENCES items(item_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS audit_logs (
  audit_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action_type VARCHAR(50),
  table_name VARCHAR(50),
  record_id INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_audit_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (first_name, last_name, username, email, password, date_of_birth, gender, user_type) 
VALUES ('Admin', 'User', 'adminprofile', 'admin@lostandfound.com', '$2a$10$fRW2rYIcxF8595PgrG3rDOJCpA6xvAjkkPTkMrJjaDmtXZ7kzgVhq', '1995-08-25', 'Male', 'Admin');
-- HASH: '$2a$10$fRW2rYIcxF8595PgrG3rDOJCpA6xvAjkkPTkMrJjaDmtXZ7kzgVhq'
-- PASSWORD: admin123

SELECT * FROM USERS;

INSERT INTO items (
  user_id,
  item_name,
  item_type,
  description,
  location,
  status,
  image_path
) VALUES
(2, 'Black Leather Wallet', 'Accessories', 'Leather wallet with some cards inside', 'Cafeteria', 'lost', 'images/wallet.jpg'),
(2, 'Red Backpack', 'Clothing', 'Medium-sized bag with school books', 'Library', 'found', 'images/backpack.png'),
(2, 'Student ID Card', 'Documents', 'University ID with name on it', 'Auditorium', 'claimed', NULL),
(2, 'Laptop Charger', 'Electronics', 'Dell charger left near desk', 'Computer Lab', 'found', 'images/charger.jpg');