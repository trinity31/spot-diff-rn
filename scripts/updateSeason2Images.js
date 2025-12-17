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
const STAGES = {
  1: { title: '비 내리는 네온 거리' },
  2: { title: '버려진 지하철역' },
  3: { title: '비밀스러운 재즈 바' },
  4: { title: '새벽의 마천루' },
  5: { title: '텅 빈 박물관의 밤' },
  6: { title: '골동품 가게의 뒷문' },
  7: { title: '달빛 아래 옥상' },
  8: { title: '안개 낀 항구' },
  9: { title: '폐쇄된 오페라 극장' },
  10: { title: '심야의 다이너' }
};

const DEFAULT_DIFFERENCES = [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }];

async function uploadStage(stageNum) {
  const stageDocId = `season${SEASON_ID}-stage${stageNum}`;
  const timestamp = Date.now();
  let updates = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  // Set basic data for creation/merge
  const baseData = {
    id: stageNum,
    title: STAGES[stageNum].title,
    seasonId: SEASON_ID,
    differences: DEFAULT_DIFFERENCES // Use default if creating new
  };

  let success = true;

  console.log(`\nProcessing Stage ${stageNum}: ${STAGES[stageNum].title}...`);

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

  // 3. Update Firestore (Set with Merge)
  if (success) {
    try {
      // Merge updates into baseData to ensure we have latest URLs + existing titles/structure
      const dataToSet = {
        ...baseData,
        ...updates
      };

      // Use set with merge: true to create if not exists, or update if exists
      // Note: This will overwrite 'differences' if it's in baseData but we probably only want to set it if missing?
      // Actually, merge: true merges top-level fields. If 'differences' exists in DB, we might overwrite it with DEFAULT if we are not careful?
      // But currently Season 2 DB is empty/missing. So initially setting DEFAULT is fine.
      // If we run this again later, we might reset differences. Better check if doc exists first?
      // For now, let's assume we are initializing Season 2.

      // A safer approach for re-running:
      // use update() first, catch NOT_FOUND, then set()

      try {
        await db.collection('stages').doc(stageDocId).update(updates);
        console.log(`  Firestore Updated (Existing).`);
      } catch (err) {
        if (err.code === 5) { // NOT_FOUND
          console.log(`  Document not found, creating new...`);
          await db.collection('stages').doc(stageDocId).set({
            ...baseData,
            ...updates
          });
          console.log(`  Firestore Created.`);
        } else {
          throw err;
        }
      }

    } catch (e) {
      console.error(`  Failed to update Firestore for stage ${stageNum}:`, e.message);
    }
  }
}

async function uploadAllSeason2() {
  console.log(`Starting Season ${SEASON_ID} Batch Upload...`);

  for (let i = 1; i <= 10; i++) {
    await uploadStage(i);
  }

  console.log('\n✅ Season 2 Upload Complete!');
  process.exit(0);
}

uploadAllSeason2();
