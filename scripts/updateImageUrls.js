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
  console.log('서비스 계정 키 파일이 없습니다.');
  process.exit(1);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function makePublicAndGetUrl(filePath) {
  try {
    const file = bucket.file(filePath);

    // 파일을 공개로 설정
    await file.makePublic();

    // 공개 URL 생성
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return publicUrl;
  } catch (error) {
    console.error(`  ❌ ${filePath} 공개 실패:`, error.message);
    return null;
  }
}

async function updateImageUrls() {
  try {
    console.log('🔧 스테이지 이미지 URL 업데이트 시작...\n');

    for (let i = 1; i <= 10; i++) {
      const stageId = `season1-stage${i}`;
      const originalPath = `game-images/seasons/season-1/stage-${i}-original.png`;
      const differencePath = `game-images/seasons/season-1/stage-${i}-difference.png`;

      console.log(`📝 Stage ${i} 처리 중...`);

      // 이미지를 공개로 설정하고 URL 가져오기
      const originalUrl = await makePublicAndGetUrl(originalPath);
      const differenceUrl = await makePublicAndGetUrl(differencePath);

      if (originalUrl && differenceUrl) {
        // Firestore 업데이트
        await db.collection('stages').doc(stageId).update({
          imageOriginalUrl: originalUrl,
          imageDifferenceUrl: differenceUrl,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`  ✅ Stage ${i} URL 업데이트 완료`);
        console.log(`     Original: ${originalUrl}`);
        console.log(`     Difference: ${differenceUrl}`);
      }
    }

    console.log('\n✨ 모든 이미지 URL 업데이트 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

updateImageUrls();
