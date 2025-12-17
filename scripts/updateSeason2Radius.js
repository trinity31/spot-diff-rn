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
const SEASON_ID = 2;

async function updateSeason2Radius() {
  console.log(`Updating radius for Season ${SEASON_ID}...`);

  const stagesRef = db.collection('stages');
  // We want to query where document ID starts with 'season2-' but Firestore doesn't support generic string startsWith easily on doc IDs in query (client side filtering).
  // But we know IDs: season2-stage1 to season2-stage10.

  for (let i = 1; i <= 10; i++) {
    const docId = `season${SEASON_ID}-stage${i}`;
    const docRef = stagesRef.doc(docId);

    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.log(`  Document ${docId} does not exist. Skipping.`);
        continue;
      }

      const data = doc.data();
      if (data.differences && Array.isArray(data.differences)) {
        const newDifferences = data.differences.map(diff => ({
          ...diff,
          radius: 0.05
        }));

        await docRef.update({
          differences: newDifferences,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`  Updated ${docId} radius to 0.05`);
      } else {
        console.log(`  ${docId} has no differences array.`);
      }

    } catch (e) {
      console.error(`  Error updating ${docId}:`, e.message);
    }
  }

  console.log('✅ Update Complete!');
  process.exit(0);
}

updateSeason2Radius();
