const twilio = require('twilio');
const creds = require('./twilioCreds.json');

module.exports = new twilio.Twilio(creds.accountSid, creds.authToken);
