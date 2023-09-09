import * as validators from '../validators';

let usernames = {
  '_test!!': false,
  'ab423423 ABC': false,
  'abcdefgabcdefgab': false,
  '0': true,
  'true': true,
  'ABCdefgabcde123': true,
};

describe('Username validity tests', () => {
  for (const [username, validity] of Object.entries(usernames)) {
    test(`Test the validity of '${username}', which is ${validity}`, () => {
      expect(validators.validateUsername(username)).toEqual(validity);
    });
  }
});

let passwords = {
  'password!@#123': true,
  '!@@#$%^&*()[]{}|\\?1': true,
  '😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂': true, //72 bytes
  '😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂😂a': false, //73 bytes
  '': false
};

describe("Password valdity tests", () => {
  for (const [password, validity] of Object.entries(passwords)) {
    test(`Test the validity of '${password}', which is ${validity}`, () => {
      expect(validators.validatePassword(password)).toEqual(validity);
    });
  }
});
