use tienda;

CREATE TABLE users (
 id smallint unsigned NOT NULL AUTO_INCREMENT,
 username varchar(30) NOT NULL,
 password char(102) NOT NULL,
 fullname varchar(50),
 usertype tinyint NOT NULL,
 PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

CREATE TABLE users (
 id smallint unsigned NOT NULL AUTO_INCREMENT,
 link varchar(100) NOT NULL,
 password char(102) NOT NULL,
 fullname varchar(50),
 usertype tinyint NOT NULL,
 PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


DELIMITER //
CREATE PROCEDURE sp_AddUser(IN pUsername VARCHAR(30), IN pPassword VARCHAR(102), IN pFullName
VARCHAR(50), in pUserType tinyint)
BEGIN
 DECLARE hashedPassword VARCHAR(255);
 SET hashedPassword = SHA2(pPassword, 256); -- Utiliza SHA-256 para hashear la contraseña.
 INSERT INTO users (username, password, fullname, usertype )
 VALUES (pUsername, hashedPassword, pFullName, pUserType);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_verifyIdentity(IN pUsername VARCHAR(30), IN pPlainTextPassword VARCHAR(20))
BEGIN
 DECLARE storedPassword VARCHAR(255);

 SELECT password INTO storedPassword FROM users
 WHERE username = pUsername COLLATE utf8mb4_unicode_ci;

 IF storedPassword IS NOT NULL AND storedPassword = SHA2(pPlainTextPassword, 256) THEN
 SELECT id, username, storedPassword, fullname, usertype FROM users
 WHERE username = pUsername COLLATE utf8mb4_unicode_ci;
 ELSE
	SELECT NULL;
	END IF;
END //
DELIMITER ;

call sp_AddUser("admin2","admin","Marco Santana",1);
call sp_verifyIdentity("admin","123");

call sp_AddUser("cliente","123","Juan perez",2);
call sp_verifyIdentity("cliente","123");

select *
from users;

delete from users where id=8;
