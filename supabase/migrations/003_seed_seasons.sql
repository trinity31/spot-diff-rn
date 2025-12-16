-- Insert Seasons
INSERT INTO seasons (id, season_number, title, description, total_stages, difficulty, illustration_icon, illustration_colors, unlock_condition) VALUES
(1, 'SEASON 1', '발견의 시작', '탐험가의 첫 걸음을 내딛는 곳입니다. 따뜻한 겨울 풍경 속에서 숨겨진 비밀을 찾아보세요.', 30, 3, '☀️', '["#fbbf24", "#f59e0b"]', NULL),
(2, 'SEASON 2', '도시의 미스터리', '번화한 도시 속에 숨겨진 이야기들을 발견하세요. 복잡한 거리와 건물 사이의 차이를 찾아보세요.', 35, 4, '🏙️', '["#3b82f6", "#2563eb"]', '{"type": "season_complete", "season_id": 1}'),
(3, 'SEASON 3', '숲 속의 탐험', '신비로운 숲 속을 탐험하며 자연의 비밀을 찾아보세요. 더 어려운 도전이 기다립니다.', 40, 5, '🌲', '["#10b981", "#059669"]', '{"type": "season_complete", "season_id": 2}'),
(4, 'SEASON 4', '우주의 비밀', '광활한 우주를 여행하며 가장 어려운 차이점을 찾아보세요. 최고의 집중력이 필요합니다.', 50, 5, '🚀', '["#8b5cf6", "#7c3aed"]', '{"type": "season_complete", "season_id": 3}');
