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
const START_STAGE = 4;
const END_STAGE = 10;

async function uploadStage(stageNum) {
  const stageDocId = `season${SEASON_ID}-stage${stageNum}`;
  const timestamp = Date.now();
  let updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  let success = true;

  console.log(`\nProcessing Season ${SEASON_ID} Stage ${stageNum}...`);

  // 1. Upload Original
  const origLocal = path.join(__dirname, '..', 'assets', 'images', `season${SEASON_ID}`, `season${SEASON_ID}_stage${stageNum}_orig.png`);
  const origRemote = `game-images/seasons/season-${SEASON_ID}/stage-${stageNum}-original.png`;

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
    console.error(`  Failed to upload original for stage ${stageNum}:`, e.message);
    success = false;
  }

  // 2. Upload Difference
  const diffLocal = path.join(__dirname, '..', 'assets', 'images', `season${SEASON_ID}`, `season${SEASON_ID}_stage${stageNum}_diff.png`);
  const diffRemote = `game-images/seasons/season-${SEASON_ID}/stage-${stageNum}-difference.png`;

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
    console.error(`  Failed to upload difference for stage ${stageNum}:`, e.message);
    success = false;
  }

  // 3. Update Firestore
  if (success) {
    try {
      await db.collection('stages').doc(stageDocId).update(updates);
      console.log(`  Firestore Updated.`);
    } catch (e) {
      console.error(`  Failed to update Firestore for stage ${stageNum}:`, e.message);
    }
  }
}

async function uploadBatch() {
  console.log(`Starting Season ${SEASON_ID} Batch Upload (Stages ${START_STAGE}-${END_STAGE})...`);

  for (let i = START_STAGE; i <= END_STAGE; i++) {
    await uploadStage(i);
  }

  console.log('\n✅ Batch Upload Complete!');
  process.exit(0);
}

uploadBatch();
