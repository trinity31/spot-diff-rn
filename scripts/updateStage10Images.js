require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const path = require('path');

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

async function uploadStage10Images() {
  const stageDocId = 'season1-stage10';
  const timestamp = Date.now();
  let updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };

  // Original
  const origLocal = path.join(__dirname, '..', 'assets', 'images', 'season1', 'season1_stage10_orig.png');
  const origRemote = 'game-images/seasons/season-1/stage-10-original.png';
  try {
    console.log(`Uploading Original: ${origLocal}`);
    await bucket.upload(origLocal, { destination: origRemote, metadata: { contentType: 'image/png', cacheControl: 'no-cache' }, public: true });
    const [origUrl] = await bucket.file(origRemote).getSignedUrl({ action: 'read', expires: '03-01-2500' });
    updates.imageOriginalUrl = `${origUrl}&t=${timestamp}`;
    console.log('Original uploaded');
  } catch (e) { console.error('Failed to upload original:', e); }

  // Difference
  const diffLocal = path.join(__dirname, '..', 'assets', 'images', 'season1', 'season1_stage10_diff.png');
  const diffRemote = 'game-images/seasons/season-1/stage-10-difference.png';
  try {
    console.log(`Uploading Difference: ${diffLocal}`);
    await bucket.upload(diffLocal, { destination: diffRemote, metadata: { contentType: 'image/png', cacheControl: 'no-cache' }, public: true });
    const [diffUrl] = await bucket.file(diffRemote).getSignedUrl({ action: 'read', expires: '03-01-2500' });
    updates.imageDifferenceUrl = `${diffUrl}&t=${timestamp}`;
    console.log('Difference uploaded');
  } catch (e) { console.error('Failed to upload difference:', e); }

  // Firestore update
  try {
    await db.collection('stages').doc(stageDocId).update(updates);
    console.log('✅ Stage 10 Images Updated Successfully!');
    process.exit(0);
  } catch (e) {
    console.error('Failed to update Firestore:', e);
    process.exit(1);
  }
}

uploadStage10Images();
