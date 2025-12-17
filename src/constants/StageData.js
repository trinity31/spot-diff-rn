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
      { id: 1, x: 0.1794, y: 0.3072, radius: 0.05 },
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
    differences: [
      { id: 1, x: 0.1715, y: 0.4190, radius: 0.05 },
      { id: 2, x: 0.7489, y: 0.6928, radius: 0.05 },
      { id: 3, x: 0.5347, y: 0.7429, radius: 0.05 },
      { id: 4, x: 0.0348, y: 0.7450, radius: 0.05 },
      { id: 5, x: 0.3117, y: 0.7210, radius: 0.05 },
    ],
  },
  2: {
    id: 2,
    title: '버려진 지하철역',
    imageOrig: require('../../assets/images/season2/season2_stage2_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage2_diff.png'),
    differences: [
      { id: 1, x: 0.6992, y: 0.3051, radius: 0.05 },
      { id: 2, x: 0.7802, y: 0.7200, radius: 0.05 },
      { id: 3, x: 0.2316, y: 0.4796, radius: 0.05 },
      { id: 4, x: 0.7053, y: 0.4650, radius: 0.05 },
      { id: 5, x: 0.1036, y: 0.3741, radius: 0.05 },
    ],
  },
  3: {
    id: 3,
    title: '비밀스러운 재즈 바',
    imageOrig: require('../../assets/images/season2/season2_stage3_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage3_diff.png'),
    differences: [
      { id: 1, x: 0.7567, y: 0.2989, radius: 0.05 },
      { id: 2, x: 0.2839, y: 0.7659, radius: 0.05 },
      { id: 3, x: 0.0401, y: 0.6489, radius: 0.05 },
      { id: 4, x: 0.4842, y: 0.6750, radius: 0.05 },
      { id: 5, x: 0.2395, y: 0.2173, radius: 0.05 },
    ],
  },
  4: {
    id: 4,
    title: '새벽의 마천루',
    imageOrig: require('../../assets/images/season2/season2_stage4_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage4_diff.png'),
    differences: [
      { id: 1, x: 0.2769, y: 0.1693, radius: 0.05 },
      { id: 2, x: 0.0253, y: 0.6082, radius: 0.05 },
      { id: 3, x: 0.2551, y: 0.8851, radius: 0.07 },
      { id: 4, x: 0.4084, y: 0.9028, radius: 0.05 },
      { id: 5, x: 0.7410, y: 0.4932, radius: 0.05 },
    ],
  },
  5: {
    id: 5,
    title: '텅 빈 박물관의 밤',
    imageOrig: require('../../assets/images/season2/season2_stage5_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage5_diff.png'),
    differences: [
      { id: 1, x: 0.0688, y: 0.4869, radius: 0.05 },
      { id: 2, x: 0.4824, y: 0.5569, radius: 0.05 },
      { id: 3, x: 0.6966, y: 0.2299, radius: 0.05 },
      { id: 4, x: 0.8325, y: 0.5549, radius: 0.05 },
      { id: 5, x: 0.6505, y: 0.7544, radius: 0.05 },
    ],
  },
  6: {
    id: 6,
    title: '골동품 가게의 뒷문',
    imageOrig: require('../../assets/images/season2/season2_stage6_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage6_diff.png'),
    differences: [
      { id: 1, x: 0.2220, y: 0.1484, radius: 0.07 },
      { id: 2, x: 0.3588, y: 0.0794, radius: 0.07 },
      { id: 3, x: 0.1028, y: 0.8245, radius: 0.07 },
      { id: 4, x: 0.4894, y: 0.7649, radius: 0.05 },
      { id: 5, x: 0.6217, y: 0.4838, radius: 0.05 },
    ],
  },
  7: {
    id: 7,
    title: '달빛 아래 옥상',
    imageOrig: require('../../assets/images/season2/season2_stage7_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage7_diff.png'),
    differences: [
      { id: 1, x: 0.3840, y: 0.0993, radius: 0.07 },
      { id: 2, x: 0.1472, y: 0.5089, radius: 0.07 },
      { id: 3, x: 0.7123, y: 0.9060, radius: 0.07 },
      { id: 4, x: 0.1951, y: 0.2989, radius: 0.05 },
      { id: 5, x: 0.4276, y: 0.6980, radius: 0.05 },
    ],
  },
  8: {
    id: 8,
    title: '안개 낀 항구',
    imageOrig: require('../../assets/images/season2/season2_stage8_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage8_diff.png'),
    differences: [
      { id: 1, x: 0.8673, y: 0.8130, radius: 0.07 },
      { id: 2, x: 0.7201, y: 0.2780, radius: 0.05 },
      { id: 3, x: 0.5477, y: 0.4357, radius: 0.05 },
      { id: 4, x: 0.2438, y: 0.7868, radius: 0.05 },
      { id: 5, x: 0.9282, y: 0.6656, radius: 0.05 },
    ],
  },
  9: {
    id: 9,
    title: '폐쇄된 오페라 극장',
    imageOrig: require('../../assets/images/season2/season2_stage9_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage9_diff.png'),
    differences: [
      { id: 1, x: 0.6609, y: 0.1609, radius: 0.07 },
      { id: 2, x: 0.8377, y: 0.8224, radius: 0.07 },
      { id: 3, x: 0.8351, y: 0.6144, radius: 0.05 },
      { id: 4, x: 0.2090, y: 0.1118, radius: 0.05 },
      { id: 5, x: 0.2464, y: 0.3814, radius: 0.05 },
    ],
  },
  10: {
    id: 10,
    title: '심야의 다이너',
    imageOrig: require('../../assets/images/season2/season2_stage10_orig.png'),
    imageDiff: require('../../assets/images/season2/season2_stage10_diff.png'),
    differences: [
      { id: 1, x: 0.2342, y: 0.3009, radius: 0.07 },
      { id: 2, x: 0.5442, y: 0.2863, radius: 0.05 },
      { id: 3, x: 0.8925, y: 0.7126, radius: 0.05 },
      { id: 4, x: 0.4336, y: 0.5674, radius: 0.05 },
      { id: 5, x: 0.6870, y: 0.4410, radius: 0.05 },
    ],
  },
};
