import mysql from 'mysql'; 
import bcrypt from 'bcryptjs';
import 'dotenv/config';

/**
 * Adds the user with the passed in username, email, and password to the 
 * MySQL user database, returning the id of the user.
 */
export async function add(
  username: string, email: string, password: string) {
  
  return new Promise<number>((resolve, reject) => {
    let userId = -1;

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    
    let connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
    });

    connection.connect(error => {
      if (error) {
        reject(error);
      }
    });
  
    //This is how mysql module suggests handling SQL injection attacks.
    let queryUsername = connection.escape(username); 
    let queryEmail = connection.escape(email);
    let queryPassword = connection.escape(hashedPassword);
    let table = process.env.MYSQL_TABLE;
    let query = `
      INSERT INTO ${table} (username, email, hashed_password, score) 
      VALUES (${queryUsername}, ${queryEmail}, ${queryPassword}, 0);
    `;
    
    connection.query(query, function (error, results) {
      if (error && error.errno !== 1062) { //1062 is dup key
        reject(error);
      }; 
      if (!error) {
        userId = results.insertId;
      }
      resolve(userId); 
    });
    
    connection.end(error => {
      if (error) {
        reject(error);
      }
    });
  });
};

/**
 * Removes the user with the passed in id from the MySQL user database.
 */
export async function remove(userId: number) {
  return new Promise((resolve, reject) => {  
    let connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
    });

    connection.connect(error => {
      if (error) {
        reject(error)
      };
    });
  
    let query = `
      DELETE 
      FROM ${process.env.MYSQL_TABLE}
      WHERE userId=${userId};
    `;  

    connection.query(query, error => {
      if (error) {
        reject(error);
      };
      resolve(undefined);
    });
    
    connection.end(error => {
      if (error) {
        reject(error);
      }
    });
  });
};

/**
 * Checks whether the user with the passed in username exists in the MySQL user 
 * database.
 */
export async function exists(username: string) {
  return new Promise((resolve, reject) => {
    let userId = -1;

    let connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
    });

    connection.connect(error => {
      if (error) {
        reject(error);
      }
    });
  
    let queryUsername = connection.escape(username); 
    let query = `
      SELECT userId
      FROM ${process.env.MYSQL_TABLE}
      WHERE username=${queryUsername};
    `;
    connection.query(query, (error, results) => {
      if (error){
        reject(error);
      };
      if (results.length > 0) {
        userId = results[0].userId;
      }
      resolve(userId)
    });

    connection.end(error => {
      if (error) {
        reject(error);
      }
    });
  });
};