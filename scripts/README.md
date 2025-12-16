# Firebase 설정 가이드

## 1. Firebase 서비스 계정 키 다운로드

Firebase Admin SDK를 사용하려면 서비스 계정 키가 필요합니다.

### 다운로드 방법:
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 선택 (find-diff-29f49)
3. ⚙️ 설정 > 프로젝트 설정 > 서비스 계정 탭
4. "새 비공개 키 생성" 버튼 클릭
5. JSON 파일 다운로드
6. 다운로드한 파일을 `scripts/serviceAccountKey.json`으로 저장

⚠️ **중요**: `serviceAccountKey.json`은 민감한 정보이므로 절대 Git에 커밋하지 마세요!

## 2. Firestore 시드 데이터 업로드

시즌과 스테이지 데이터를 Firestore에 업로드합니다.

```bash
npm run seed:firestore
```

이 명령어는:
- 4개의 시즌 데이터를 `seasons` 컬렉션에 추가
- 5개의 스테이지 데이터를 `stages` 컬렉션에 추가

## 3. Firebase Storage 이미지 업로드

게임 이미지를 Firebase Storage에 업로드합니다.

```bash
npm run upload:images
```

이 명령어는:
- `assets/images/` 폴더의 이미지를 Firebase Storage에 업로드
- `game-images/seasons/season-1/` 경로에 저장
- 업로드된 이미지는 공개 URL로 접근 가능

### 이미지 파일명 규칙:
- 원본 이미지: `stage1_original.png`, `stage2_original.png`, ...
- 차이 이미지: `stage1_difference.png`, `stage2_difference.png`, ...

## 4. Firestore 보안 규칙 설정

Firebase Console에서 Firestore Database > 규칙 탭으로 이동하여 아래 규칙을 설정하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Seasons 컬렉션 (공개 읽기)
    match /seasons/{seasonId} {
      allow read: if true;
      allow write: if false;
    }

    // Stages 컬렉션 (공개 읽기)
    match /stages/{stageId} {
      allow read: if true;
      allow write: if false;
    }

    // 사용자 진행 상황 (본인만 읽기/쓰기)
    match /userProgress/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 리더보드 (공개 읽기, 본인만 쓰기)
    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. Firebase Storage 보안 규칙 설정

Firebase Console에서 Storage > 규칙 탭으로 이동하여 아래 규칙을 설정하세요:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /game-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 트러블슈팅

### "서비스 계정 키 파일이 없습니다" 오류
- `scripts/serviceAccountKey.json` 파일이 있는지 확인
- Firebase Console에서 새 키를 다운로드하여 재시도

### 권한 오류
- Firebase Console에서 서비스 계정의 권한 확인
- "Cloud Datastore User" 및 "Storage Admin" 역할이 있는지 확인

### 이미지 업로드 실패
- `assets/images/` 폴더에 이미지 파일이 있는지 확인
- 파일명이 규칙을 따르는지 확인 (예: `stage1_original.png`)
