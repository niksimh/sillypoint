import { createClient } from "redis";
import 'dotenv/config';

/**
 * Adds the user with the passed in username and score to the leaderboard 
 * stored in Redis. If no score has been passed, a score of 0 is set.
 */
export async function add(username: string, score?: number) {
  if (score === undefined) {
    score = 0;
  }

  const client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    client.quit();
    throw error;
  });

  await client.connect();
  await client.zAdd('leaderboard', { value: username, score: score });
  await client.quit();
};

/**
 * Retrieves the rank and score of the user with the passed in username from the 
 * leaderboard stored in Redis.
 */
export async function get(username: string) {
  let rank = -1;
  let score: number | null = 0; 

  const client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    client.quit();
    throw error;
  });

  await client.connect();
  score = await client.zScore('leaderboard', username);
  if (score !== null) {
    rank = await client.zCount('leaderboard', '('+score, '+inf');
    rank += 1;
  }
  await client.quit();

  return { rank, score }; 
};

/**
 * Removes the user with the passed in username from the leaderboard stored in 
 * Redis. 
 */
export async function remove(username: string) {
  const client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    client.quit();
    throw error;
  });

  await client.connect();
  await client.zRem('leaderboard', username);
  await client.quit();
};

/**
 * Updates the leaderboard entry for the passed in user in the leaderboard 
 * stored in Redis.
 */
export async function update(
  username: string , updateValue: number) {
  
  const client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    client.quit();
    throw error;
  });

  await client.connect();
  let score = (await client.zScore('leaderboard', username))!;
  if (score + updateValue < 0) {
    updateValue = -1 * score; //we're not allowing negative scores.
  }
  await client.zIncrBy('leaderboard', updateValue, username);
  await client.quit();
  
}

/**
 * Retrieves 3 users from offset from the leaderboard stored in Redis. 
 */
export async function getRange(offset: number) {
  let scores: {score: number, value: string}[] = [];
  let count; 

  const client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    client.quit();
    throw error;
  });

  await client.connect();

  //TODO: maybe don't need these adjustements.
  count = await client.zCard('leaderboard');
  if (offset < 0) {
    offset = 0;
  } else if (offset > count - 1) {
      offset = count - 1
  }

  offset = Math.floor(offset/3) * 3;
  
  scores = await client.zRangeWithScores('leaderboard', '+inf', '-inf', {
    BY: 'SCORE',
    REV: true,
    LIMIT: {
      offset: offset,
      count: 3
    },
  });

  await client.quit();
  return scores;
}