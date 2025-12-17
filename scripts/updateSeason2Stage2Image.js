require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase
let app;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
} catch (error) {
  app = admin.initializeApp({
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

const bucket = admin.storage().bucket();
const db = admin.firestore();

const SEASON_ID = 2;
const STAGE_NUM = 2;

async function uploadStage2() {
  const stageDocId = `season${SEASON_ID}-stage${STAGE_NUM}`;
  const timestamp = Date.now();
  let updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  let success = true;

  console.log(`\nProcessing Season ${SEASON_ID} Stage ${STAGE_NUM}...`);

  // Upload Original (Just in case, though user said diff)
  const origLocal = path.join(__dirname, '..', 'assets', 'images', `season${SEASON_ID}`, `season${SEASON_ID}_stage${STAGE_NUM}_orig.png`);
  const origRemote = `game-images/seasons/season-${SEASON_ID}/stage-${STAGE_NUM}-original.png`;

  try {
    await bucket.upload(origLocal, {
      destination: origRemote,
      metadata: { contentType: 'image/png', cacheControl: 'no-cache' },
      public: true
    });

    const [origUrl] = await bucket.file(origRemote).getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });
    updates.imageOriginalUrl = `${origUrl}&t=${timestamp}`;
    console.log('  Original Uploaded.');
  } catch (e) {
    console.error(`  Failed to upload original:`, e.message);
  }

  // Upload Difference
  const diffLocal = path.join(__dirname, '..', 'assets', 'images', `season${SEASON_ID}`, `season${SEASON_ID}_stage${STAGE_NUM}_diff.png`);
  const diffRemote = `game-images/seasons/season-${SEASON_ID}/stage-${STAGE_NUM}-difference.png`;

  try {
    await bucket.upload(diffLocal, {
      destination: diffRemote,
      metadata: { contentType: 'image/png', cacheControl: 'no-cache' },
      public: true
    });

    const [diffUrl] = await bucket.file(diffRemote).getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });
    updates.imageDifferenceUrl = `${diffUrl}&t=${timestamp}`;
    console.log('  Difference Uploaded.');
  } catch (e) {
    console.error(`  Failed to upload difference:`, e.message);
    success = false;
  }

  // Update Firestore
  if (success) {
    try {
      await db.collection('stages').doc(stageDocId).update(updates);
      console.log(`  Firestore Updated.`);
    } catch (e) {
      console.error(`  Failed to update Firestore:`, e.message);
    }
  }

  process.exit(0);
}

uploadStage2();
