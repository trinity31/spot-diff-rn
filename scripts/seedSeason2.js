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

// Season 2 stages
const season2Stages = [
  {
    id: "season2-stage1",
    seasonId: 2,
    stageNumber: 1,
    title: "비 내리는 네온 거리",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-1-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-1-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-1-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage2",
    seasonId: 2,
    stageNumber: 2,
    title: "버려진 지하철역",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-2-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-2-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-2-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage3",
    seasonId: 2,
    stageNumber: 3,
    title: "비밀스러운 재즈 바",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-3-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-3-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-3-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage4",
    seasonId: 2,
    stageNumber: 4,
    title: "새벽의 마천루",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-4-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-4-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-4-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage5",
    seasonId: 2,
    stageNumber: 5,
    title: "텅 빈 박물관의 밤",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-5-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-5-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-5-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage6",
    seasonId: 2,
    stageNumber: 6,
    title: "골동품 가게의 뒷문",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-6-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-6-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-6-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage7",
    seasonId: 2,
    stageNumber: 7,
    title: "달빛 아래 옥상",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-7-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-7-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-7-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage8",
    seasonId: 2,
    stageNumber: 8,
    title: "안개 낀 항구",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-8-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-8-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-8-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage9",
    seasonId: 2,
    stageNumber: 9,
    title: "폐쇄된 오페라 극장",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-9-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-9-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-9-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season2-stage10",
    seasonId: 2,
    stageNumber: 10,
    title: "심야의 다이너",
    imageOriginalUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-10-original.png`,
    imageDifferenceUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-10-difference.png`,
    imageThumbnailUrl: `https://storage.googleapis.com/${bucketName}/game-images/seasons/season-2/stage-10-original-thumb.png`,
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 4,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function seedSeason2() {
  try {
    console.log('🌱 Season 2 스테이지 데이터 업로드 시작...\n');

    for (const stage of season2Stages) {
      await db.collection('stages').doc(stage.id).set(stage, { merge: true });
      console.log(`  ✅ Stage ${stage.stageNumber}: ${stage.title}`);
    }

    console.log('\n✨ Season 2 데이터 업로드 완료!');
    console.log(`  - 스테이지: ${season2Stages.length}개`);

    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

seedSeason2();
