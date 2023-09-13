import jwt from 'jsonwebtoken';
import { createClient } from "redis";
import 'dotenv/config';

export type tokenType = 'refresh' | 'access'

interface token {
  type: tokenType
  payload: object
}

export interface refreshToken extends token {
  type: 'refresh',
  payload: {
    id: string,
    username: string, 
    userId: number
  }
}; 

export interface accessToken extends token {
  type: 'access',
  payload: {
    refreshTokenId: string,
    username: string, 
    userId: number
  }
} 

const ex = new Map<tokenType, number>();
ex.set('refresh', 604800);
ex.set('access', 86400);

/**
 * Creates a token of the passed in token type.
 */
export function createToken<t extends token>(tokenInfo: t) {
  //Other info is put in token body by module. 
  let secret: string = process.env[tokenInfo.type]!;
  let jwtPayload = { payload: tokenInfo.payload };
  return jwt.sign(jwtPayload, secret, { expiresIn: ex.get(tokenInfo.type) });
}

/**
 * Verifies the token, returning its payload. An empty object is retured if the 
 * token is invalid.
 */
export function verifyToken(jwtToken: string, type: tokenType) {
  let payload;
  try {
    let secret: string = process.env[type]!;
    payload = (jwt.verify(jwtToken, secret) as token).payload;
  } catch {
    payload = {};
  }
  return payload;
}

/**
 * Activates the refresh token by storing it in the user:<userId> set in Redis. 
 */
export async function activateRefreshToken(
  userId: number, refreshTokenId: string) {  
  
  let client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    throw error;
  });

  await client.connect();
  await client.sAdd('user:'+userId, refreshTokenId);
  await client.quit();
}

/**
 * Checks the active status of the refresh token for the passed in user. 
 */
export async function isRefreshTokenActive(
  userId: number, refreshTokenId: string) {
  
  let isActive = false;

  let client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    throw error;
  });

  await client.connect();
  isActive = await client.sIsMember('user:'+userId, refreshTokenId);
  await client.quit();

  return isActive;
}

/**
 * Deletes the user:<userId> set, functionally deactivating all the refresh 
 * tokens.
 */
export async function deactivateRefreshTokens(userId: number) {
  let client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    throw error;
  });

  await client.connect();
  await client.del('user:'+userId);
  await client.quit();
}