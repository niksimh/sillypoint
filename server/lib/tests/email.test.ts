import sendResetEmail from '../email';
import 'dotenv/config';

//Integration test by nature. 

test('Test sending a password reset email', async() => {
  let sender = process.env.TEST_SENDER_EMAIL!;
  let recipient = process.env.TEST_RECIPIENT_EMAIL!;
  
  let emailInfo = await sendResetEmail(sender, recipient, 'testContent');

  expect(emailInfo.accepted).toEqual([process.env.TEST_RECIPIENT_EMAIL]);
  
  let responseSplit = emailInfo.response.split(' ');
  expect(responseSplit[0]).toEqual('250');
  expect(responseSplit[1]).toEqual('Ok');
})