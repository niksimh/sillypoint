/**
 * Checks whether the passed in username is valid. Currently, usernames must be 
 * alphanumeric and have a length >= 1 and <= 15.
 */
export function validateUsername(username: string): boolean {
  let usernameRegex = new RegExp('^[a-zA-Z0-9]{1,15}$');
  return usernameRegex.test(username);
}