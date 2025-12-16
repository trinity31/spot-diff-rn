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

    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const docId = `season1-stage${stageNum}`;
      const thumbFileName = `stage-${stageNum}-original-thumb.png`;
      const thumbUrl = `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-1/${thumbFileName}`;

      await db.collection('stages').doc(docId).update({
        imageThumbnailUrl: thumbUrl
      });

      console.log(`✓ ${docId} 업데이트 완료`);
      console.log(`  URL: ${thumbUrl}\n`);
    }

    console.log('✨ Firestore 업데이트 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

updateThumbnailUrls();
