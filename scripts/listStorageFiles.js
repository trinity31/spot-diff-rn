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

const bucket = admin.storage().bucket();

async function listFiles() {
  try {
    console.log('📂 Firebase Storage 파일 목록:\n');

    const [files] = await bucket.getFiles({ prefix: 'game-images/' });

    if (files.length === 0) {
      console.log('❌ 파일이 없습니다.');
    } else {
      files.forEach(file => {
        console.log(`  📄 ${file.name}`);
      });
      console.log(`\n총 ${files.length}개 파일`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

listFiles();
