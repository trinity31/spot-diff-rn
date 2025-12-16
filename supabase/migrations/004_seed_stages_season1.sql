-- Season 1 Stages
-- NOTE: 이미지 URL은 Supabase Storage 업로드 후 실제 URL로 교체해야 합니다
-- 형식: https://[your-project-ref].supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-X-original.png

INSERT INTO stages (season_id, stage_number, title, image_original_url, image_difference_url, differences) VALUES
(1, 1, '아늑한 거실',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-1-original.png',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-1-difference.png',
  '[
    {"id": 1, "x": 0.5547, "y": 0.0512, "radius": 0.06},
    {"id": 2, "x": 0.1951, "y": 0.4483, "radius": 0.06},
    {"id": 3, "x": 0.3292, "y": 0.8370, "radius": 0.06},
    {"id": 4, "x": 0.4363, "y": 0.8903, "radius": 0.06},
    {"id": 5, "x": 0.7541, "y": 0.7273, "radius": 0.06}
  ]'::jsonb),

(1, 2, '눈 내리는 거리',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-2-original.png',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-2-difference.png',
  '[
    {"id": 1, "x": 0.45, "y": 0.15, "radius": 0.06},
    {"id": 2, "x": 0.62, "y": 0.38, "radius": 0.06},
    {"id": 3, "x": 0.23, "y": 0.71, "radius": 0.06},
    {"id": 4, "x": 0.78, "y": 0.52, "radius": 0.06},
    {"id": 5, "x": 0.51, "y": 0.89, "radius": 0.06}
  ]'::jsonb),

(1, 3, '산타의 선물',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-3-original.png',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-3-difference.png',
  '[
    {"id": 1, "x": 0.52, "y": 0.18, "radius": 0.06},
    {"id": 2, "x": 0.35, "y": 0.42, "radius": 0.06},
    {"id": 3, "x": 0.68, "y": 0.65, "radius": 0.06},
    {"id": 4, "x": 0.21, "y": 0.78, "radius": 0.06},
    {"id": 5, "x": 0.82, "y": 0.91, "radius": 0.06}
  ]'::jsonb),

(1, 4, '루돌프와 썰매',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-4-original.png',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-4-difference.png',
  '[
    {"id": 1, "x": 0.38, "y": 0.22, "radius": 0.06},
    {"id": 2, "x": 0.58, "y": 0.45, "radius": 0.06},
    {"id": 3, "x": 0.42, "y": 0.68, "radius": 0.06},
    {"id": 4, "x": 0.72, "y": 0.81, "radius": 0.06},
    {"id": 5, "x": 0.15, "y": 0.35, "radius": 0.06}
  ]'::jsonb),

(1, 5, '장작불 앞',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-5-original.png',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-5-difference.png',
  '[
    {"id": 1, "x": 0.48, "y": 0.12, "radius": 0.06},
    {"id": 2, "x": 0.64, "y": 0.39, "radius": 0.06},
    {"id": 3, "x": 0.29, "y": 0.58, "radius": 0.06},
    {"id": 4, "x": 0.71, "y": 0.75, "radius": 0.06},
    {"id": 5, "x": 0.41, "y": 0.88, "radius": 0.06}
  ]'::jsonb);

-- 나머지 25개 스테이지는 동일한 형식으로 추가하면 됩니다
-- Stage 6-30은 이미지가 준비되면 아래 템플릿을 사용하여 추가:
/*
(1, 6, '스테이지 제목',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-6-original.png',
  'https://your-project.supabase.co/storage/v1/object/public/game-images/seasons/season-1/stage-6-difference.png',
  '[
    {"id": 1, "x": 0.5, "y": 0.2, "radius": 0.06},
    {"id": 2, "x": 0.3, "y": 0.4, "radius": 0.06},
    {"id": 3, "x": 0.7, "y": 0.6, "radius": 0.06},
    {"id": 4, "x": 0.4, "y": 0.8, "radius": 0.06},
    {"id": 5, "x": 0.6, "y": 0.9, "radius": 0.06}
  ]'::jsonb),
*/
