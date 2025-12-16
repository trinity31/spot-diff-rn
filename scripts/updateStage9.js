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

const STAGE_ID = 'season1-stage9';
const NEW_DIFFERENCES = [
  { id: 1, x: 0.0923, y: 0.3072, radius: 0.075 },
  { id: 2, x: 0.1541, y: 0.1808, radius: 0.075 },
  { id: 3, x: 0.2403, y: 0.2497, radius: 0.075 },
  { id: 4, x: 0.4563, y: 0.3542, radius: 0.075 },
  { id: 5, x: 0.4545, y: 0.5047, radius: 0.075 },
];

async function updateStage9() {
  try {
    console.log(`Updating ${STAGE_ID} differences...`);

    await db.collection('stages').doc(STAGE_ID).update({
      differences: NEW_DIFFERENCES,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Successfully updated Stage 9 differences!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating stage:', error);
    process.exit(1);
  }
}

updateStage9();
