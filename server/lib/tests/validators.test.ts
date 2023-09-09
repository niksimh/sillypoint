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