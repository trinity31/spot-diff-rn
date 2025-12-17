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

const STAGE_ID = 'season2-stage9';
const NEW_DIFFERENCES = [
  { id: 1, x: 0.6609, y: 0.1609, radius: 0.07 },
  { id: 2, x: 0.8377, y: 0.8224, radius: 0.07 },
  { id: 3, x: 0.8351, y: 0.6144, radius: 0.05 },
  { id: 4, x: 0.2090, y: 0.1118, radius: 0.05 },
  { id: 5, x: 0.2464, y: 0.3814, radius: 0.05 },
];

async function updateSeason2Stage9() {
  try {
    console.log(`Updating ${STAGE_ID} differences...`);

    await db.collection('stages').doc(STAGE_ID).update({
      differences: NEW_DIFFERENCES,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Successfully updated Season 2 Stage 9 differences!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating stage:', error);
    process.exit(1);
  }
}

updateSeason2Stage9();
