/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const { onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const logger = require('firebase-functions/logger');

exports.helloWorld = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

// The Firebase Admin SDK to delete inactive users.
const admin = require('firebase-admin');
admin.initializeApp();

// The es6-promise-pool to limit the concurrency of promises.
// const PromisePool = require('es6-promise-pool').default;
// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3;

// exports.handleUserAccountability = onSchedule('every day 00:00', async (e) => {
exports.handleUserAccountability = onRequest(async (req, res) => {
  // Loop through users in realtime database and see if they are a month late on their post
  const usersRef = admin.database().ref('users');

  const userSnapshot = await usersRef.once('value');
  const users = userSnapshot.val();

  logger.info(users, { structuredData: true });

  // Loop through user UIDs
  Object.keys(users).forEach((uid) => {
    const user = users[uid];
    // get user start date
    const userStartDate = new Date(user.joined).getDate();

    // get latest post day
    const latestPostDay = new Date(user.latestPost).getDate();

    // get latest post month
    const latestPostMonth = new Date(user.latestPost).getMonth();

    // get today's date
    const todaysDate = new Date().getDate();

    // get today's month
    const todaysMonth = new Date().getMonth();

    // check if user start date is on this date of the month
    if (userStartDate === todaysDate) {
      // check if user has posted this month
      logger.info(`User: ${user}`, { structuredData: true });

      if (latestPostMonth < todaysMonth) {
        // if not, send them a notification
        logger.info(
          'User post date is today and they have not posted this month',
          { structuredData: true }
        );
      } else {
        // if they have posted this month, do nothing
        logger.info('User post date is today and they have posted this month', {
          structuredData: true,
        });
      }
    } else {
      // if not, do nothing
      logger.info('User post not due today', { structuredData: true });
    }
  });
  res.send('All checks done');
});
