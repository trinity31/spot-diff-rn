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

const STAGE_ID = 'season2-stage3';
const NEW_DIFFERENCES = [
  { id: 1, x: 0.7567, y: 0.2989, radius: 0.05 },
  { id: 2, x: 0.2839, y: 0.7659, radius: 0.05 },
  { id: 3, x: 0.0401, y: 0.6489, radius: 0.05 },
  { id: 4, x: 0.4842, y: 0.6750, radius: 0.05 },
  { id: 5, x: 0.2395, y: 0.2173, radius: 0.05 },
];

async function updateSeason2Stage3() {
  try {
    console.log(`Updating ${STAGE_ID} differences...`);

    await db.collection('stages').doc(STAGE_ID).update({
      differences: NEW_DIFFERENCES,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Successfully updated Season 2 Stage 3 differences!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating stage:', error);
    process.exit(1);
  }
}

updateSeason2Stage3();
