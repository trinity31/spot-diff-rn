
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfettiSystem } from '../components/ConfettiSystem';
import FirebaseDataService from '../services/FirebaseDataService';

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { seasonId, stageId } = route.params || {};
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Load Stage Data from Firebase
  const [stageData, setStageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [showClearModal, setShowClearModal] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [cachedImages, setCachedImages] = useState({
    original: null,
    difference: null
  });
  const [imagesLoaded, setImagesLoaded] = useState({
    original: false,
    difference: false
  });
  const [isSeasonComplete, setIsSeasonComplete] = useState(false);

  useEffect(() => {
    loadStageData();
  }, [seasonId, stageId]);

  // ... (imports)

  // ... (imports)

  const loadStageData = async () => {
    try {
      setLoading(true);

      // 이미지 로딩 상태 초기화
      setImagesLoaded({
        original: false,
        difference: false
      });

      // 1. Firebase에서 스테이지 데이터 로드
      const stage = await FirebaseDataService.getStageById(`season${seasonId}-stage${stageId}`);
      console.log('GameScreen - 로드된 스테이지:', stage);
      setStageData(stage);

      // 2. 이미지 URL 직접 사용 (캐싱 제거)
      setCachedImages({
        original: stage.imageOriginalUrl,
        difference: stage.imageDifferenceUrl
      });

      // 데이터 로딩은 완료되었지만, 이미지 로딩은 Image 컴포넌트에서 추적
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stage:', error);
      setLoading(false);
    }
  };

  // Check Win Condition
  useEffect(() => {
    if (stageData && foundDifferences.length === stageData.differences.length) {
      const isLastStage = stageId === 10;
      setIsSeasonComplete(isLastStage);
      setGameState('won');
      handleWin();
    }
  }, [foundDifferences, stageData]);

  // 데이터 로딩 중이거나, 이미지 URL이 없으면 로딩 화면 표시
  if (loading || !cachedImages.original || !cachedImages.difference) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingTitle}>
            {stageData?.title || `스테이지 ${stageId}`}
          </Text>
          <Text style={styles.loadingSubtitle}>
            이미지를 불러오는 중...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (!stageData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Stage {stageId} Data Not Found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20 }}>
          <Text style={{ color: 'blue' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dynamic Calculation
  // Dynamic Calculation
  const HEADER_HEIGHT_CONTENT = 60; // Reverted to 60 for safety
  const HEADER_TOTAL_HEIGHT = HEADER_HEIGHT_CONTENT + insets.top;

  const FOOTER_HEIGHT_CONTENT = 40;
  const FOOTER_TOTAL_HEIGHT = FOOTER_HEIGHT_CONTENT + insets.bottom + 20; // Reverted padding to +20

  // Added -20 safety margin to prevent overlap
  const AVAILABLE_HEIGHT = height - HEADER_TOTAL_HEIGHT - FOOTER_TOTAL_HEIGHT - 20;
  const AVAILABLE_WIDTH = width;

  const MAX_IMAGE_HEIGHT = AVAILABLE_HEIGHT / 2;
  const MAX_IMAGE_WIDTH = AVAILABLE_WIDTH;

  // For 1.2:1 Aspect Ratio
  const IMAGE_ASPECT_RATIO = 1.2;

  // Calculate based on width (Targeting Full Width)
  let finalWidth = MAX_IMAGE_WIDTH;
  let finalHeight = finalWidth / IMAGE_ASPECT_RATIO;

  // If calculating based on width results in too tall images, scale down
  // But on most modern phones, 3:2 fits easily in half-height.
  if (finalHeight > MAX_IMAGE_HEIGHT) {
    finalHeight = MAX_IMAGE_HEIGHT;
    finalWidth = finalHeight * IMAGE_ASPECT_RATIO;
  }

  const handleWin = async () => {
    // Stars are now fixed to 3 for clearing
    const stars = 3;
    const score = 1000; // Fixed score per stage clear

    await FirebaseDataService.saveStageClear(seasonId, stageId, stars, score);

    setShowClearModal(true);
  };

  const handleNextStage = async () => {
    const nextStageId = stageId + 1;
    const isLastStageOfSeason = nextStageId > 10;

    setShowClearModal(false);

    if (!isLastStageOfSeason) {
      // Navigate to next stage (replace current screen)
      navigation.replace('Game', {
        seasonId: seasonId,
        stageId: nextStageId
      });
    } else {
      // Season complete - unlock next season's first stage
      const nextSeasonId = seasonId + 1;
      await FirebaseDataService.unlockStage(nextSeasonId, 1);

      // Go to SeasonScreen with scroll to next season
      navigation.navigate('Season', {
        completedSeasonId: seasonId,
        scrollToSeasonId: nextSeasonId
      });
    }
  };

  const resetGame = () => {
    // setTimeLeft(MOCK_STAGE_DATA.timeLimit); // Removed
    setFoundDifferences([]);
    setGameState('playing');
  };

  const handleTouch = (event) => {
    if (gameState !== 'playing') return;
    const { locationX, locationY } = event.nativeEvent;

    // Normalize touch to 0.0 - 1.0
    const xPct = locationX / finalWidth;
    const yPct = locationY / finalHeight;
    const coordStr = `x: ${xPct.toFixed(4)}, y: ${yPct.toFixed(4)}`;
    console.log(`[CLICK COORDINATE] ${coordStr}`);

    let found = false;
    stageData.differences.forEach((diff) => {
      if (foundDifferences.includes(diff.id)) return;

      // Calculate distance in normalized space (simple circle check)
      // Note: This assumes square image.
      const distance = Math.sqrt(
        Math.pow(xPct - diff.x, 2) + Math.pow(yPct - diff.y, 2)
      );

      if (distance < diff.radius) {
        setFoundDifferences(prev => [...prev, diff.id]);
        found = true;
      }
    });
  };

  // Helper to determine image source
  const getImageSource = (img) => {
    if (typeof img === 'number') {
      return img;
    }
    return { uri: img };
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{stageData.title}</Text>
        </View>

        <View style={{ width: 50 }} />
      </View>

      {/* Game Area */}
      <View style={styles.gameContent}>
        <View style={[styles.gameCard, { width: finalWidth, height: finalHeight * 2 + 2, backgroundColor: 'transparent' }]}>
          {/* Top Image */}
          <Pressable onPress={handleTouch} style={{ width: finalWidth, height: finalHeight }}>
            <Image
              source={getImageSource(cachedImages.original)}
              style={styles.gameImage}
              resizeMode="contain"
              onLoadEnd={() => {
                setImagesLoaded(prev => ({ ...prev, original: true }));
              }}
            />

            {/* Markers */}
            {foundDifferences.map(id => {
              const diff = stageData.differences.find(d => d.id === id);
              if (!diff) return null;

              // Calculate pixel position
              const left = diff.x * finalWidth;
              const top = diff.y * finalHeight;
              const size = diff.radius * finalWidth * 2; // Radius relative to width

              return (
                <View
                  key={`top-${id}`}
                  pointerEvents="none"
                  style={[
                    styles.marker,
                    {
                      left: left - size / 2,
                      top: top - size / 2,
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      borderColor: '#10b981',
                      borderWidth: 3,
                    }
                  ]}
                />
              );
            })}
          </Pressable>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Bottom Image */}
          <Pressable onPress={handleTouch} style={{ width: finalWidth, height: finalHeight }}>
            <Image
              source={getImageSource(cachedImages.difference)}
              style={styles.gameImage}
              resizeMode="contain"
              onLoadEnd={() => {
                setImagesLoaded(prev => ({ ...prev, difference: true }));
              }}
            />
            {foundDifferences.map(id => {
              const diff = stageData.differences.find(d => d.id === id);
              if (!diff) return null;

              const left = diff.x * finalWidth;
              const top = diff.y * finalHeight;
              const size = diff.radius * finalWidth * 2;

              return (
                <View
                  key={`bottom-${id}`}
                  pointerEvents="none"
                  style={[
                    styles.marker,
                    {
                      left: left - size / 2,
                      top: top - size / 2,
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      borderColor: '#10b981',
                      borderWidth: 3,
                    }
                  ]}
                />
              );
            })}
          </Pressable>
        </View>
      </View>

      {/* Footer Info */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>

        {/* Left: Hearts */}
        <View style={styles.footerLeft}>
          <Text style={styles.heartEmoji}>❤️</Text>
          <Text style={styles.heartCount}>{hearts}</Text>
        </View>

        {/* Center: Progress */}
        <View style={styles.footerCenter}>
          <Text style={styles.progressText}>
            {foundDifferences.length} / {stageData.differences.length}
          </Text>
        </View>

        {/* Right: Hint Button */}
        <TouchableOpacity style={styles.footerRight}>
          <View style={styles.hintButton}>
            <Ionicons name="search" size={24} color="white" />
          </View>
        </TouchableOpacity>

      </View>

      {/* 이미지 로딩 오버레이 */}
      {(!imagesLoaded.original || !imagesLoaded.difference) && (
        <View style={styles.imageLoadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingTitle}>
            {stageData.title}
          </Text>
          <Text style={styles.loadingSubtitle}>
            이미지를 불러오는 중...
          </Text>
        </View>
      )}

      {/* Stage Clear Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showClearModal}
        onRequestClose={() => navigation.goBack()}
      >
        <View style={styles.modalOverlay}>
          {/* Confetti Background in Modal Overlay */}
          <ConfettiSystem />

          <LinearGradient
            colors={['#faf5ff', '#d8b4fe']} // Soft lavender gradient
            style={styles.modalContent}
          >
            {/* Title */}
            <Text style={styles.modalTitle}>
              {isSeasonComplete
                ? `축하합니다!\n시즌 ${seasonId}을(를) 완료했어요!`
                : '축하합니다!'}
            </Text>

            {/* Big Emoji */}
            <Text style={styles.centerEmoji}>
              {isSeasonComplete ? '🏆' : '🎉'}
            </Text>

            {/* Subtitle for season complete */}
            {isSeasonComplete && (
              <Text style={styles.modalSubtitle}>
                모든 스테이지를 클리어했습니다!
              </Text>
            )}

            {/* Next Button */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextStage}
            >
              <Text style={styles.nextButtonText}>
                {isSeasonComplete ? '다음 시즌으로' : '다음 스테이지'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
  },
  loadingSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(102, 126, 234, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 28, // Increased size for the arrow symbol
    fontWeight: 'bold',
  },
  // timerContainer: Removed
  // timerText: Removed
  scoreContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    color: 'white',
    fontSize: 14, // Slightly scale text down
    fontWeight: 'bold',
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    width: '100%',
  },
  gameCard: {
    // Width/Height dynamic
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // backgroundColor: 'transparent',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  divider: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#00ff00', // Bright green for markers
    backgroundColor: 'transparent',
  },
  // Header Styles
  headerTitleContainer: {
    // backgroundColor: '#ffffff', // Removed
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20, // Slightly larger for better visibility without background
  },

  // Footer Styles
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    backgroundColor: 'transparent',
    width: '100%',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  heartCount: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  heartEmoji: {
    fontSize: 28,
  },
  footerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  hintButton: {
    backgroundColor: '#fbbf24', // Amber/Yellow
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucency adjusted
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    // backgroundColor: '#ffffff', // Removed for gradient
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  centerEmoji: {
    fontSize: 60,
    marginBottom: 24,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  emojiContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 16,
  },
  bigEmoji: {
    fontSize: 48,
  },
  nextButton: {
    backgroundColor: '#8b5cf6', // Main Purple
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameScreen;
