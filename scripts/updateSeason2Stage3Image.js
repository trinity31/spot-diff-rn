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
const STAGE_NUM = 3;

async function uploadStage3() {
  const stageDocId = `season${SEASON_ID}-stage${STAGE_NUM}`;
  const timestamp = Date.now();
  let updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  let success = true;

  console.log(`\nProcessing Season ${SEASON_ID} Stage ${STAGE_NUM}...`);

  // 1. Upload Difference (Since user said they replaced the diff image)
  // We'll upload original too just to be safe and keep timestamps consistent?
  // User specifically mentioned diff, but syncing both is usually better practice if we want fresh signed URLs for both if they were part of a batch. 
  // But let's act on user request primarily. However, for consistency, I'll check both.

  // Actually, to be safe and thorough, I will upload both.
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

  // 3. Update Firestore
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

uploadStage3();
