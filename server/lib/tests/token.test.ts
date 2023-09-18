import * as token from '../token';

const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT;

test('Test creating and verifying refresh tokens', () => {
  let refresh = {
    type: 'refresh' as 'refresh',
    payload: {
      id: 'id',
      username: 'username', 
      userId: 1
    }
  };

  let validToken = token.createToken(refresh);
  expect(token.verifyToken(validToken, 'refresh')).toEqual(refresh.payload);
});

test('Test creating and verifying access tokens', () => {
  let access = {
    type: 'access' as 'access',
    payload: {
      refreshTokenId: 'id',
      username: 'username', 
      userId: 1
    }
  };

  let validToken = token.createToken(access);
  expect(token.verifyToken(validToken, 'access')).toEqual(access.payload);
});

test('Test verifying an invalid token', () => {
  expect(token.verifyToken('', 'access')).toEqual({});
});

test('Test token database error', async () => {
  delete process.env.REDIS_ENDPOINT;
  
  await expect(token.activateRefreshToken(1, '1'))
    .rejects.toEqual(expect.anything());
});

test('Test activating, deactivating, and' + 
  ' checking the status of refresh tokens', async () => {
  
  process.env.REDIS_ENDPOINT = REDIS_ENDPOINT;
    
  let userId = 10;
  
  //Activate refresh token and check its active status. 
    await token.activateRefreshToken(userId, 'someRandomTokenId1');
  expect(await token.isRefreshTokenActive(userId, 'someRandomTokenId1'))
    .toEqual(true);
  expect(await token.isRefreshTokenActive(userId, 'someRandomTokenId2'))
    .toEqual(false);
  await token.deactivateRefreshTokens(userId);
  expect(await token.isRefreshTokenActive(userId, 'someRandomTokenId1'))
    .toEqual(false);
});