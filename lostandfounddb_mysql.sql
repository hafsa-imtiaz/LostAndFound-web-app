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
select * from items;
SELECT status FROM items;


INSERT INTO users (first_name, last_name, username, email, password, date_of_birth, gender, profile_picture, user_type) VALUES
('Michael', 'Brown', 'michaelb', 'michaelb@example.com', 'hashed_password3', '1992-12-10', 'Male', NULL, 'User'),
('Emily', 'Davis', 'emilyd', 'emilyd@example.com', 'hashed_password4', '2000-03-05', 'Female', NULL, 'User'),
('Chris', 'Wilson', 'chrisw', 'chrisw@example.com', 'hashed_password5', '1997-07-19', 'Male', NULL, 'User'),
('Sarah', 'Taylor', 'saraht', 'saraht@example.com', 'hashed_password6', '1993-11-30', 'Female', NULL, 'User'),
('David', 'Martinez', 'davidm', 'davidm@example.com', 'hashed_password7', '1991-04-22', 'Male', NULL, 'User'),
('Laura', 'Anderson', 'lauraa', 'lauraa@example.com', 'hashed_password8', '1999-08-14', 'Female', NULL, 'User'),
('James', 'Thomas', 'jamest', 'jamest@example.com', 'hashed_password9', '1996-05-11', 'Male', NULL, 'User'),
('Olivia', 'Harris', 'oliviah', 'oliviah@example.com', 'hashed_password10', '2001-02-28', 'Female', NULL, 'User'),
('Daniel', 'Clark', 'danielc', 'danielc@example.com', 'hashed_password11', '1994-10-09', 'Male', NULL, 'User'),
('Sophia', 'Lewis', 'sophial', 'sophial@example.com', 'hashed_password12', '1990-06-18', 'Female', NULL, 'User'),
('Matthew', 'Walker', 'mattheww', 'mattheww@example.com', 'hashed_password13', '1989-09-21', 'Male', NULL, 'User'),
('Emma', 'Hall', 'emmah', 'emmah@example.com', 'hashed_password14', '2002-07-07', 'Female', NULL, 'User'),
('Ryan', 'Allen', 'ryana', 'ryana@example.com', 'hashed_password15', '1995-01-16', 'Male', NULL, 'User'),
('Isabella', 'Young', 'isabellay', 'isabellay@example.com', 'hashed_password16', '1998-03-25', 'Female', NULL, 'User'),
('Andrew', 'King', 'andrewk', 'andrewk@example.com', 'hashed_password17', '1993-12-05', 'Male', NULL, 'User'),
('Charlotte', 'Wright', 'charlottew', 'charlottew@example.com', 'hashed_password18', '2000-08-29', 'Female', NULL, 'User'),
('Ethan', 'Scott', 'ethans', 'ethans@example.com', 'hashed_password19', '1997-11-12', 'Male', NULL, 'User'),
('Mia', 'Green', 'miag', 'miag@example.com', 'hashed_password20', '1999-06-03', 'Female', NULL, 'User');



INSERT INTO items (user_id, item_name, item_type, description, location, status, image_path) VALUES
(1, 'Black Wallet', 'Personal Item', 'A black leather wallet with multiple cards inside.', 'Library', 'lost', 'images/wallet.jpg'),
(2, 'iPhone 12', 'Electronics', 'White iPhone 12 with a cracked screen.', 'Cafeteria', 'found', 'images/iphone12.jpg'),
(3, 'Red Backpack', 'Bag', 'A red backpack containing books and a laptop.', 'Lecture Hall 3', 'lost', 'images/backpack.jpg'),
(4, 'Car Keys', 'Accessories', 'Set of car keys with a Toyota logo keychain.', 'Parking Lot', 'lost', 'images/carkeys.jpg'),
(5, 'Silver Bracelet', 'Jewelry', 'Silver bracelet with an engraved name.', 'Gym', 'found', 'images/bracelet.jpg'),
(6, 'Dell Laptop', 'Electronics', 'Dell Inspiron laptop with charger.', 'Computer Lab', 'lost', 'images/laptop.jpg'),
(7, 'Sunglasses', 'Accessories', 'Ray-Ban sunglasses with black frames.', 'Student Lounge', 'found', 'images/sunglasses.jpg'),
(8, 'Physics Notebook', 'Stationery', 'Physics notebook with important notes.', 'Library', 'returned', 'images/notebook.jpg'),
(9, 'Bluetooth Earbuds', 'Electronics', 'Black Bluetooth earbuds in a charging case.', 'Bus Stop', 'lost', 'images/earbuds.jpg'),
(10, 'Hoodie', 'Clothing', 'Grey hoodie with a university logo on the chest.', 'Sports Complex', 'claimed', 'images/hoodie.jpg');


