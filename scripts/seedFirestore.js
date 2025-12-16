require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Firebase Admin 초기화
// 서비스 계정 키 파일이 있다면 사용, 없다면 환경 변수로 초기화
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

// 시즌 데이터 (SeasonScreen.js에서 가져옴)
const seasons = [
  {
    id: 1,
    seasonNumber: "SEASON 1",
    title: "발견의 시작",
    description: "탐험가의 첫 걸음을 내딛어보세요.",
    totalStages: 10,
    difficulty: 3,
    illustrationIcon: "☀️",
    illustrationColors: ["#fbbf24", "#f59e0b"],
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 2,
    seasonNumber: "SEASON 2",
    title: "도시의 미스터리",
    description: "밤의 도시에 숨겨진 비밀을 찾아내세요.",
    totalStages: 10,
    difficulty: 4,
    illustrationIcon: "🌙",
    illustrationColors: ["#3b82f6", "#1d4ed8"],
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 3,
    seasonNumber: "SEASON 3",
    title: "숲 속의 탐험",
    description: "신비로운 숲을 탐험하며 자연 속 숨겨진 디테일을 발견하세요.",
    totalStages: 10,
    difficulty: 5,
    illustrationIcon: "🌲",
    illustrationColors: ["#10b981", "#059669"],
    active: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 4,
    seasonNumber: "SEASON 4",
    title: "세계 여행",
    description: "전 세계를 여행하며 각 나라의 숨겨진 차이를 찾아보세요.",
    totalStages: 10,
    difficulty: 5,
    illustrationIcon: "✈️",
    illustrationColors: ["#6366f1", "#4f46e5"],
    active: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// 스테이지 데이터 (StageData.js에서 가져온 Season 1의 10개 스테이지)
// 이미지 URL은 Firebase Storage 업로드 후 실제 URL로 교체 필요
const stages = [
  {
    id: "season1-stage1",
    seasonId: 1,
    stageNumber: 1,
    title: "아늑한 거실",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-1-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-1-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-1-original-thumb.png",
    differences: [
      { id: 1, x: 0.5547, y: 0.0512, radius: 0.06 },
      { id: 2, x: 0.1951, y: 0.4483, radius: 0.06 },
      { id: 3, x: 0.3292, y: 0.8370, radius: 0.06 },
      { id: 4, x: 0.4363, y: 0.8903, radius: 0.06 },
      { id: 5, x: 0.7541, y: 0.7273, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage2",
    seasonId: 1,
    stageNumber: 2,
    title: "눈 내리는 거리",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-2-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-2-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-2-original-thumb.png",
    differences: [
      { id: 1, x: 0.4876, y: 0.0690, radius: 0.06 },
      { id: 2, x: 0.5921, y: 0.4086, radius: 0.06 },
      { id: 3, x: 0.6966, y: 0.7346, radius: 0.06 },
      { id: 4, x: 0.6862, y: 0.9801, radius: 0.06 },
      { id: 5, x: 0.0496, y: 0.4984, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage3",
    seasonId: 1,
    stageNumber: 3,
    title: "화사한 봄날의 소풍",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-3-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-3-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-3-original-thumb.png",
    differences: [
      { id: 1, x: 0.5547, y: 0.0512, radius: 0.06 },
      { id: 2, x: 0.1951, y: 0.4483, radius: 0.06 },
      { id: 3, x: 0.3292, y: 0.8370, radius: 0.06 },
      { id: 4, x: 0.4363, y: 0.8903, radius: 0.06 },
      { id: 5, x: 0.7541, y: 0.7273, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage4",
    seasonId: 1,
    stageNumber: 4,
    title: "신비한 마법 서재",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-4-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-4-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-4-original-thumb.png",
    differences: [
      { id: 1, x: 0.5547, y: 0.0512, radius: 0.06 },
      { id: 2, x: 0.1951, y: 0.4483, radius: 0.06 },
      { id: 3, x: 0.3292, y: 0.8370, radius: 0.06 },
      { id: 4, x: 0.4363, y: 0.8903, radius: 0.06 },
      { id: 5, x: 0.7541, y: 0.7273, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage5",
    seasonId: 1,
    stageNumber: 5,
    title: "나른한 오후의 카페",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-5-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-5-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-5-original-thumb.png",
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage6",
    seasonId: 1,
    stageNumber: 6,
    title: "주말의 즐거운 대청소",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-6-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-6-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-6-original-thumb.png",
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage7",
    seasonId: 1,
    stageNumber: 7,
    title: "학교 옥상의 점심시간",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-7-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-7-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-7-original-thumb.png",
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage8",
    seasonId: 1,
    stageNumber: 8,
    title: "편의점의 늦은 밤",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-8-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-8-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-8-original-thumb.png",
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage9",
    seasonId: 1,
    stageNumber: 9,
    title: "비 오는 날의 버스정류장",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-9-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-9-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-9-original-thumb.png",
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: "season1-stage10",
    seasonId: 1,
    stageNumber: 10,
    title: "한강 공원의 치킨 배달",
    imageOriginalUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-10-original.png?alt=media",
    imageDifferenceUrl: "https://firebasestorage.googleapis.com/v0/b/find-diff-29f49.appspot.com/o/game-images%2Fseasons%2Fseason-1%2Fstage-10-difference.png?alt=media",
    imageThumbnailUrl: "https://storage.googleapis.com/find-diff-29f49.firebasestorage.app/game-images/seasons/season-1/stage-10-original-thumb.png",
    differences: [
      { id: 1, x: 0.5, y: 0.5, radius: 0.06 }
    ],
    difficulty: 3,
    hintCount: 3,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function seedFirestore() {
  try {
    console.log('🌱 Firestore 시드 데이터 업로드 시작...\n');

    // 시즌 데이터 업로드
    console.log('📅 시즌 데이터 업로드 중...');
    for (const season of seasons) {
      await db.collection('seasons').doc(season.id.toString()).set(season);
      console.log(`  ✅ ${season.seasonNumber}: ${season.title}`);
    }

    console.log('\n🎮 스테이지 데이터 업로드 중...');
    for (const stage of stages) {
      await db.collection('stages').doc(stage.id).set(stage);
      console.log(`  ✅ Stage ${stage.stageNumber}: ${stage.title}`);
    }

    console.log('\n✨ 시드 데이터 업로드 완료!');
    console.log(`  - 시즌: ${seasons.length}개`);
    console.log(`  - 스테이지: ${stages.length}개 (Season 1)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

seedFirestore();
