import * as leaderboard from '../leaderboard';
import { createClient } from "redis";
import 'dotenv/config';

//Integration tests by nature since function logic for all execute on Redis. 

//In case of failures, clear test Redis instance.
afterEach(async () => {
  let client = createClient({
    url: process.env.REDIS_ENDPOINT
  });

  client.on('error', (error) => {
    throw error;
  });

  await client.connect();
  await client.flushDb();
  await client.quit();
});

const users = {
  user1: {rank: 8, score: 1},
  user2: {rank: 6, score: 2},
  user3: {rank: 6, score: 2},
  user4: {rank: 2, score: 3},
  user5: {rank: 2, score: 3},
  user6: {rank: 2, score: 3},
  user7: {rank: 2, score: 3},
  user8: {rank: 1, score: 4}
};

test('Test adding, getting, and removing from the leaderboard', async () => {
  try {
    let rank, score;
    
    //Add users with scores.
    for(let [username, data] of Object.entries(users)) {
      await leaderboard.add(username, data.score);
    }

    //Add a user without a specified score. 
    await leaderboard.add('user9');

    //Get the rank and score of users with explicit scores. 
    for(let [username, data] of Object.entries(users)) {
      ({rank, score} = await leaderboard.get(username));
      expect(rank).toEqual(data.rank);
      expect(score).toEqual(data.score);
    }

    //Get the rank and score of the user without a specified score. user9 is 
    //last with a score of 0.
    ({rank, score} = await leaderboard.get('user9'));
    expect(rank).toEqual(9);
    expect(score).toEqual(0);

    //Remove users and verify removal with their rank = -1.
    for(let [username, _] of Object.entries(users)) {
      await leaderboard.remove(username);
      ({rank} = await leaderboard.get(username));
      expect(rank).toEqual(-1);
    }
    await leaderboard.remove('user9');
    ({rank} = await leaderboard.get('user9'));
    expect(rank).toEqual(-1);
  } catch (error) {
    throw error;
  } 
});

test('Test updating a leaderboard entry', async () => {
  try {
    let won = 3;
    let lost = -2; 
    
    //Add a user to the leaderboard
    await leaderboard.add('user0', 0);
  
    let actualScore = 0;
    let score;
    //user0 wins (score = 3).
    actualScore += won;
    await leaderboard.update('user0', won);
    ({score} = await leaderboard.get('user0')); 
    expect(score).toEqual(actualScore);
    
    //user0 loses (score = 1).
    actualScore += lost;
    await leaderboard.update('user0', lost);
    ({score} = await leaderboard.get('user0')); 
    expect(score).toEqual(actualScore);

    //user0 loses (score = 0, not -1).
    actualScore = 0;
    await leaderboard.update('user0', lost);
    ({score} = await leaderboard.get('user0')); 
    expect(score).toEqual(actualScore);

    //user0 loses again (score = 0).
    actualScore = 0;
    await leaderboard.update('user0', lost);
    ({score} = await leaderboard.get('user0')); 
    expect(score).toEqual(actualScore);

    //Cleanup 
    await leaderboard.remove('user0');
  } catch (error) {
    throw error;
  }
});