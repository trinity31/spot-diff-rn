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

const STAGE_ID = 'season2-stage2';
const NEW_DIFFERENCES = [
  { id: 1, x: 0.6992, y: 0.3051, radius: 0.06 },
  { id: 2, x: 0.7802, y: 0.7200, radius: 0.06 },
  { id: 3, x: 0.2316, y: 0.4796, radius: 0.06 },
  { id: 4, x: 0.7053, y: 0.4650, radius: 0.06 },
  { id: 5, x: 0.1036, y: 0.3741, radius: 0.06 },
];

async function updateSeason2Stage2() {
  try {
    console.log(`Updating ${STAGE_ID} differences...`);

    await db.collection('stages').doc(STAGE_ID).update({
      differences: NEW_DIFFERENCES,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Successfully updated Season 2 Stage 2 differences!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating stage:', error);
    process.exit(1);
  }
}

updateSeason2Stage2();
