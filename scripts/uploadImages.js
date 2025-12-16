require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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

const bucket = admin.storage().bucket();

async function uploadImage(localPath, remotePath) {
  try {
    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
      },
      public: true
    });

    const file = bucket.file(remotePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });

    return url;
  } catch (error) {
    console.error(`  ❌ 업로드 실패: ${remotePath}`, error.message);
    return null;
  }
}

async function uploadImages() {
  console.log('🖼️  Firebase Storage 이미지 업로드 시작...\n');

  const assetsPath = path.join(__dirname, '..', 'assets', 'images', 'season1');

  // Season 1 스테이지 이미지 업로드
  console.log('📦 Season 1 스테이지 이미지 업로드 중...');

  for (let i = 1; i <= 10; i++) {
    const originalPath = path.join(assetsPath, `season1_stage${i}_orig.png`);
    const differencePath = path.join(assetsPath, `season1_stage${i}_diff.png`);

    if (fs.existsSync(originalPath)) {
      const remoteOriginal = `game-images/seasons/season-1/stage-${i}-original.png`;
      const url = await uploadImage(originalPath, remoteOriginal);
      if (url) {
        console.log(`  ✅ Stage ${i} - Original 업로드 완료`);
      }
    } else {
      console.log(`  ⚠️  Stage ${i} - Original 파일 없음: ${originalPath}`);
    }

    if (fs.existsSync(differencePath)) {
      const remoteDifference = `game-images/seasons/season-1/stage-${i}-difference.png`;
      const url = await uploadImage(differencePath, remoteDifference);
      if (url) {
        console.log(`  ✅ Stage ${i} - Difference 업로드 완료`);
      }
    } else {
      console.log(`  ⚠️  Stage ${i} - Difference 파일 없음: ${differencePath}`);
    }
  }

  console.log('\n✨ 이미지 업로드 완료!');
  process.exit(0);
}

uploadImages().catch(error => {
  console.error('❌ 에러 발생:', error);
  process.exit(1);
});
