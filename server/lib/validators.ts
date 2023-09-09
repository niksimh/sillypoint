/**
 * Checks whether the passed in username is valid. Currently, usernames must be 
 * alphanumeric and have a length >= 1 and <= 15.
 */
export function validateUsername(username: string): boolean {
  let usernameRegex = new RegExp('^[a-zA-Z0-9]{1,15}$');
  return usernameRegex.test(username);
}

/**
 * Checks whether the passed in password is valid. Passwords are required to be 
 * non-empty and <= 72 bytes for hashing purposes, and they are UTF-8 encoded. 
 */
export function validatePassword(password: string): boolean {
  return password !== '' && Buffer.byteLength(password, 'utf8') <= 72;
}