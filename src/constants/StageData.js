// Season 1 Data
// Titles:
// 1: 아늑한 거실
// 2: 눈 내리는 거리
// 3: 신비한 마법 서재
// 4: 화사한 봄날의 소풍

export const SEASON1_STAGES = {
  1: {
    id: 1,
    title: '아늑한 거실',
    imageOrig: require('../../assets/images/season1/season1_stage1_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage1_diff.png'),
    differences: [
      { id: 1, x: 0.5547, y: 0.0512, radius: 0.06 }, // Star
      { id: 2, x: 0.1951, y: 0.4483, radius: 0.06 }, // Stocking
      { id: 3, x: 0.3292, y: 0.8370, radius: 0.06 }, // Gift Box 1
      { id: 4, x: 0.4363, y: 0.8903, radius: 0.06 }, // Gift Box 2
      { id: 5, x: 0.7541, y: 0.7273, radius: 0.06 }, // Cat
    ],
  },
  2: {
    id: 2,
    title: '눈 내리는 거리',
    imageOrig: require('../../assets/images/season1/season1_stage2_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage2_diff.png'),
    differences: [
      // Placeholder coordinates (copy of Stage 1 for now)
      { id: 1, x: 0.4876, y: 0.0690, radius: 0.06 },
      { id: 2, x: 0.5921, y: 0.4086, radius: 0.06 },
      { id: 3, x: 0.6966, y: 0.7346, radius: 0.06 },
      { id: 4, x: 0.6862, y: 0.9801, radius: 0.06 },
      { id: 5, x: 0.0496, y: 0.4984, radius: 0.06 },
    ],
  },
  3: {
    id: 3,
    title: '화사한 봄날의 소풍',
    imageOrig: require('../../assets/images/season1/season1_stage3_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage3_diff.png'),
    differences: [
      { id: 1, x: 0.4171, y: 0.2027, radius: 0.075 },
      { id: 2, x: 0.2647, y: 0.3877, radius: 0.075 },
      { id: 3, x: 0.6392, y: 0.6865, radius: 0.075 },
      { id: 4, x: 0.7262, y: 0.9122, radius: 0.075 },
      { id: 5, x: 0.0531, y: 0.5047, radius: 0.075 },
    ],
  },
  4: {
    id: 4,
    title: '신비한 마법 서재',
    imageOrig: require('../../assets/images/season1/season1_stage4_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage4_diff.png'),
    differences: [
      { id: 1, x: 0.2151, y: 0.2121, radius: 0.075 },
      { id: 2, x: 0.2908, y: 0.5935, radius: 0.075 },
      { id: 3, x: 0.1271, y: 0.6834, radius: 0.075 },
      { id: 4, x: 0.4711, y: 0.4305, radius: 0.075 },
      { id: 5, x: 0.9004, y: 0.1505, radius: 0.075 },
    ],
  },
  5: {
    id: 5,
    title: '나른한 오후의 카페',
    imageOrig: require('../../assets/images/season1/season1_stage5_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage5_diff.png'),
    differences: [
      { id: 1, x: 0.0253, y: 0.4096, radius: 0.075 },
      { id: 2, x: 0.2638, y: 0.5005, radius: 0.075 },
      { id: 3, x: 0.4371, y: 0.8004, radius: 0.075 },
      { id: 4, x: 0.6740, y: 0.8579, radius: 0.075 },
      { id: 5, x: 0.7976, y: 0.1755, radius: 0.075 },
    ],
  },
  6: {
    id: 6,
    title: '주말의 즐거운 대청소',
    imageOrig: require('../../assets/images/season1/season1_stage6_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage6_diff.png'),
    differences: [
      { id: 1, x: 0.2020, y: 0.3292, radius: 0.075 },
      { id: 2, x: 0.0575, y: 0.5319, radius: 0.075 },
      { id: 3, x: 0.0583, y: 0.8757, radius: 0.075 },
      { id: 4, x: 0.5434, y: 0.6144, radius: 0.075 },
      { id: 5, x: 0.7445, y: 0.3250, radius: 0.075 },
    ],
  },
  7: {
    id: 7,
    title: '학교 옥상의 점심시간',
    imageOrig: require('../../assets/images/season1/season1_stage7_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage7_diff.png'),
    differences: [
      { id: 1, x: 0.1393, y: 0.6499, radius: 0.075 },
      { id: 2, x: 0.6252, y: 0.2027, radius: 0.075 },
      { id: 3, x: 0.6209, y: 0.7962, radius: 0.075 },
      { id: 4, x: 0.5399, y: 0.6855, radius: 0.075 },
      { id: 5, x: 0.4519, y: 0.9070, radius: 0.075 },
    ],
  },
  8: {
    id: 8,
    title: '편의점의 늦은 밤',
    imageOrig: require('../../assets/images/season1/season1_stage8_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage8_diff.png'),
    differences: [
      { id: 1, x: 0.5146, y: 0.3480, radius: 0.075 },
      { id: 2, x: 0.6879, y: 0.4013, radius: 0.075 },
      { id: 3, x: 0.2456, y: 0.9164, radius: 0.075 },
      { id: 4, x: 0.6008, y: 0.6228, radius: 0.075 },
      { id: 5, x: 0.3710, y: 0.4786, radius: 0.075 }
    ],
  },
  9: {
    id: 9,
    title: '비 오는 날의 버스정류장',
    imageOrig: require('../../assets/images/season1/season1_stage9_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage9_diff.png'),
    differences: [
      { id: 1, x: 0.0923, y: 0.3072, radius: 0.075 },
      { id: 2, x: 0.1541, y: 0.1808, radius: 0.075 },
      { id: 3, x: 0.2403, y: 0.2497, radius: 0.075 },
      { id: 4, x: 0.4563, y: 0.3542, radius: 0.075 },
      { id: 5, x: 0.4545, y: 0.5047, radius: 0.075 },
    ],
  },
  10: {
    id: 10,
    title: '한강 공원의 치킨 배달',
    imageOrig: require('../../assets/images/season1/season1_stage10_orig.png'),
    imageDiff: require('../../assets/images/season1/season1_stage10_diff.png'),
    differences: [
      { id: 1, x: 0.1794, y: 0.3072, radius: 0.075 },
      { id: 2, x: 0.6113, y: 0.9551, radius: 0.075 },
      { id: 3, x: 0.9587, y: 0.2529, radius: 0.075 },
      { id: 4, x: 0.0357, y: 0.0773, radius: 0.075 },
      { id: 5, x: 0.3413, y: 0.4148, radius: 0.075 },
    ],
  },
};

export const SEASON2_STAGES = {
  1: {
    id: 1,
    title: '비 내리는 네온 거리',
    imageOrig: require('../../assets/images/season2/season2_stage1_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage1_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  2: {
    id: 2,
    title: '버려진 지하철역',
    imageOrig: require('../../assets/images/season2/season2_stage2_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage2_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  3: {
    id: 3,
    title: '비밀스러운 재즈 바',
    imageOrig: require('../../assets/images/season2/season2_stage3_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage3_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  4: {
    id: 4,
    title: '새벽의 마천루',
    imageOrig: require('../../assets/images/season2/season2_stage4_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage4_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  5: {
    id: 5,
    title: '텅 빈 박물관의 밤',
    imageOrig: require('../../assets/images/season2/season2_stage5_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage5_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  6: {
    id: 6,
    title: '골동품 가게의 뒷문',
    imageOrig: require('../../assets/images/season2/season2_stage6_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage6_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  7: {
    id: 7,
    title: '달빛 아래 옥상',
    imageOrig: require('../../assets/images/season2/season2_stage7_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage7_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  8: {
    id: 8,
    title: '안개 낀 항구',
    imageOrig: require('../../assets/images/season2/season2_stage8_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage8_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  9: {
    id: 9,
    title: '폐쇄된 오페라 극장',
    imageOrig: require('../../assets/images/season2/season2_stage9_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage9_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
  10: {
    id: 10,
    title: '심야의 다이너',
    imageOrig: require('../../assets/images/season2/season2_stage10_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage10_diff.png'),
    differences: [{ id: 1, x: 0.5, y: 0.5, radius: 0.06 }],
  },
};
