import * as user from '../user';
import mysql from 'mysql'; 
import 'dotenv/config';

let users = {
  user0: {
    email: 'user0@email.com',
    password: 'password0'
  },
  user1: {
    email: 'user1@email.com',
    password: 'password1'
  },
  user2: {
    email: "user2@email.com",
    password: 'password2'
  }
}

/**
 * Flush test database in case of errors. 
 */
afterEach(async () => {
  return new Promise((resolve, reject) => {
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
  
    let query = `
    DELETE from ${process.env.MYSQL_TABLE};
    `
    connection.query(query, function (error) {
      if (error) reject(error);
      resolve(undefined);
    });

    connection.end();
  });
});

test('Test adding, removing, and checking user exists', async () => { 
  //Add user0.
  let userId = await user.add(
    'user0', 
    users.user0.email, 
    users.user0.password
  );
  
  //Check that user0 exists. 
  let userIdExists = await user.exists('user0');
  expect(userIdExists).toEqual(userId);
  
  //Add user0 who is repeated. 
  let userIdRepeat = await user.add(
    'user0', 
    users.user0.email, 
    users.user0.password
  );
  expect(userIdRepeat).toEqual(-1);
  
  //Remove user0 and verify they do not exist. 
  await user.remove(userId);
  userIdExists = await user.exists('user0');
  expect(userIdExists).toEqual(-1);
});

test('Test validating user username', async () => {
  //Add user0.
  let userId = await user.add(
    'user0', 
    users.user0.email, 
    users.user0.password
  );
  
  //Check correct username.
  let validUsername = await user.validateField(
    userId, 
    'username', 
    'user0'
  );
  expect(validUsername).toEqual(true);

  //Check incorrect username.
  let invalidUsername = await user.validateField(
    userId, 
    'username', 
    ''
  );
  expect(invalidUsername).toEqual(false);
  
  //Cleanup.
  await user.remove(userId);
});

test('Test validating user password', async () => {
  //Add user0.
  let userId = await user.add(
    'user0', 
    users.user0.email, 
    users.user0.password
  );

  //Check correct password. 
  let validPassword = await user.validateField(
    userId, 
    'hashed_password', 
    users.user0.password
  );

  expect(validPassword).toEqual(true);
  
  //Check incorrect password.
  let invalidPassword = await user.validateField(
    userId, 
    'hashed_password', 
    ''
  );
  expect(invalidPassword).toEqual(false);

  //Cleanup.
  await user.remove(userId);
});

test('Test validating user email', async () => {
  //Add user0.
  let userId = await user.add(
    'user0', 
    users.user0.email, 
    users.user0.password
  );

  //Check correct email. 
  let validEmail = await user.validateField(
    userId, 
    'email', 
    users.user0.email
  );
  expect(validEmail).toEqual(true);

  //Check incorrect email.
  let invalidEmail = await user.validateField(
    userId, 
    'email', 
    '');
  expect(invalidEmail).toEqual(false);
  await user.remove(userId);
});

test('Test validation on a non-existing user', async () => {
  //Check user that does not exist.
  let invalidUserId = await user.validateField(
    -1, //no one will have a negative userId
    'email', 
    '');
  expect(invalidUserId).toEqual(false);
});