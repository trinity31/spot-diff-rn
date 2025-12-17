require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Firebase Admin 초기화
let app;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
} catch (error) {
  console.log('서비스 계정 키 파일이 없습니다. 환경 변수로 초기화합니다.');
  app = admin.initializeApp({
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

const db = admin.firestore();
const bucketName = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;

async function updateThumbnailUrls() {
  try {
    console.log('🌱 Firestore 썸네일 URL 업데이트 시작...\n');

    const SEASONS = [1, 2];

    for (const season of SEASONS) {
      console.log(`\n=== Season ${season} ===`);
      for (let stageNum = 1; stageNum <= 10; stageNum++) {
        const docId = `season${season}-stage${stageNum}`;
        const thumbFileName = `stage-${stageNum}-original-thumb.png`;
        const thumbUrl = `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-${season}/${thumbFileName}`;

        try {
          // Check if document exists before updating to avoid error if Season 2 doc missing (though we created them)
          const docRef = db.collection('stages').doc(docId);
          // We can use set with merge, but update is cleaner if we assume docs exist.
          // Since we just ran the upload script which made sure docs exist, update should be fine.

          await docRef.update({
            imageThumbnailUrl: thumbUrl
          });

          console.log(`✓ ${docId} 업데이트 완료`);
          console.log(`  URL: ${thumbUrl}`);
        } catch (e) {
          if (e.code === 5) { // NOT_FOUND
            console.log(`⚠️ ${docId} 문서가 없습니다. (Skipping)`);
          } else {
            console.error(`✗ ${docId} 업데이트 실패:`, e.message);
          }
        }
      }
    }

    console.log('\n✨ Firestore 업데이트 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

updateThumbnailUrls();
