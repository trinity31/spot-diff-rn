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

async function checkStageData() {
  try {
    console.log('🔍 스테이지 1-1 데이터 확인 중...\n');

    const stageRef = db.collection('stages').doc('season1-stage1');
    const stageDoc = await stageRef.get();

    if (!stageDoc.exists) {
      console.log('❌ 스테이지 문서가 존재하지 않습니다.');
      process.exit(1);
    }

    const data = stageDoc.data();
    console.log('✅ 스테이지 데이터:');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n📷 이미지 URL:');
    console.log('원본:', data.imageOriginalUrl);
    console.log('차이:', data.imageDifferenceUrl);

    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

checkStageData();
