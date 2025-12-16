require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

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

const db = admin.firestore();

const STAGE_ID = 'season1-stage10';
const NEW_DIFFERENCES = [
  { id: 1, x: 0.1794, y: 0.3072, radius: 0.075 },
  { id: 2, x: 0.6113, y: 0.9551, radius: 0.075 },
  { id: 3, x: 0.9587, y: 0.2529, radius: 0.075 },
  { id: 4, x: 0.0357, y: 0.0773, radius: 0.075 },
  { id: 5, x: 0.3413, y: 0.4148, radius: 0.075 },
];

async function updateStage10() {
  try {
    console.log(`Updating ${STAGE_ID} differences...`);

    await db.collection('stages').doc(STAGE_ID).update({
      differences: NEW_DIFFERENCES,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Successfully updated Stage 10 differences!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating stage:', error);
    process.exit(1);
  }
}

updateStage10();
