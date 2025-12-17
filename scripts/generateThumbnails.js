require('dotenv').config({ path: '.env.local' });
const sharp = require('sharp');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

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

const THUMBNAIL_WIDTH = 400;

async function generateThumbnail(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(THUMBNAIL_WIDTH, null, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .png({ quality: 80 })
    .toFile(outputPath);
}

async function processStage(seasonNum, stageNum, tmpDir) {
  const originalFileName = `stage-${stageNum}-original.png`;
  const thumbFileName = `stage-${stageNum}-original-thumb.png`;

  const storagePath = `game-images/seasons/season-${seasonNum}/${originalFileName}`;
  const thumbStoragePath = `game-images/seasons/season-${seasonNum}/${thumbFileName}`;

  try {
    console.log(`\n처리 중: Season ${seasonNum} - Stage ${stageNum}`);

    // 1. Firebase Storage에서 원본 다운로드
    const localOriginal = path.join(tmpDir, `s${seasonNum}_${originalFileName}`);
    await bucket.file(storagePath).download({
      destination: localOriginal
    });
    console.log(`  ✓ 원본 다운로드 완료`);

    // 2. 썸네일 생성
    const localThumb = path.join(tmpDir, `s${seasonNum}_${thumbFileName}`);
    await generateThumbnail(localOriginal, localThumb);

    // 파일 크기 확인
    const originalSize = fs.statSync(localOriginal).size;
    const thumbSize = fs.statSync(localThumb).size;
    const reduction = ((1 - thumbSize / originalSize) * 100).toFixed(1);

    console.log(`  ✓ 썸네일 생성 완료 (${(originalSize / 1024).toFixed(1)}KB → ${(thumbSize / 1024).toFixed(1)}KB, ${reduction}% 감소)`);

    // 3. Firebase Storage에 업로드
    await bucket.upload(localThumb, {
      destination: thumbStoragePath,
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000', // 1년 캐시
      }
    });
    console.log(`  ✓ 썸네일 업로드 완료`);

    // 4. 공개 URL 생성
    const file = bucket.file(thumbStoragePath);
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${thumbStoragePath}`;
    console.log(`  ✓ 공개 URL: ${publicUrl}`);

    // 임시 파일 삭제
    if (fs.existsSync(localOriginal)) fs.unlinkSync(localOriginal);
    if (fs.existsSync(localThumb)) fs.unlinkSync(localThumb);

  } catch (error) {
    if (error.code === 404) {
      console.log(`  ⚠️ 원본 이미지가 없습니다. (Skipping)`);
    } else {
      console.error(`  ✗ 실패:`, error.message);
    }
  }
}

async function uploadThumbnails() {
  const tmpDir = './tmp/thumbnails';
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  console.log('🌱 썸네일 생성 및 업로드 시작...\n');

  const SEASONS = [1, 2];

  for (const season of SEASONS) {
    console.log(`\n=== Season ${season} ===`);
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      await processStage(season, stageNum, tmpDir);
    }
  }

  console.log('\n✨ 썸네일 생성 완료!');
  process.exit(0);
}

uploadThumbnails().catch((error) => {
  console.error('❌ 에러 발생:', error);
  process.exit(1);
});
