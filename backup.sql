CREATE TABLE users(
    usersid INT NOT NULL AUTO_INCREMENT, 
    email VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (usersid)
);