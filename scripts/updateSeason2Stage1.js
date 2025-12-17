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

const STAGE_ID = 'season2-stage1';
const NEW_DIFFERENCES = [
  { id: 1, x: 0.1715, y: 0.4190, radius: 0.06 },
  { id: 2, x: 0.7489, y: 0.6928, radius: 0.06 },
  { id: 3, x: 0.5347, y: 0.7429, radius: 0.06 },
  { id: 4, x: 0.0348, y: 0.7450, radius: 0.06 },
  { id: 5, x: 0.3117, y: 0.7210, radius: 0.06 },
];

async function updateSeason2Stage1() {
  try {
    console.log(`Updating ${STAGE_ID} differences...`);

    await db.collection('stages').doc(STAGE_ID).update({
      differences: NEW_DIFFERENCES,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Successfully updated Season 2 Stage 1 differences!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating stage:', error);
    process.exit(1);
  }
}

updateSeason2Stage1();
