import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GameDataService } from '../services/GameDataService';

// Local Assets
const originalImage = require('../../assets/images/season1_stage1_3to2_v2_orig.png');
const diffImage = require('../../assets/images/season1_stage1_3to2_v2_diff.png');

// Mock Data for a stage
const MOCK_STAGE_DATA = {
  // Use require for local assets in React Native
  imageSource1: originalImage,
  imageSource2: diffImage,
  differences: [
    // Normalized coordinates (0.0 to 1.0) - High Precision Calibration 2025-12-14
    { id: 1, x: 0.5547, y: 0.0512, radius: 0.06 }, // Star
    { id: 2, x: 0.1951, y: 0.4483, radius: 0.06 }, // Stocking
    { id: 3, x: 0.3292, y: 0.8370, radius: 0.06 }, // Gift Box 1
    { id: 4, x: 0.4363, y: 0.8903, radius: 0.06 }, // Gift Box 2
    { id: 5, x: 0.7541, y: 0.7273, radius: 0.06 }, // Cat
  ],
  // timeLimit: 60, // Removed
};

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { seasonId, stageId } = route.params || {};
  const { width, height } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  // Dynamic Calculation
  const HEADER_HEIGHT_CONTENT = 60; // Actual height of header content
  const HEADER_TOTAL_HEIGHT = HEADER_HEIGHT_CONTENT + insets.top; // Adjust for top inset

  const FOOTER_HEIGHT_CONTENT = 40;
  const FOOTER_TOTAL_HEIGHT = FOOTER_HEIGHT_CONTENT + insets.bottom + 20; // +20 padding

  const AVAILABLE_HEIGHT = height - HEADER_TOTAL_HEIGHT - FOOTER_TOTAL_HEIGHT - 20; // 20 padding
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

  // const [timeLeft, setTimeLeft] = useState(MOCK_STAGE_DATA.timeLimit); // Removed
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [gameState, setGameState] = useState('playing');

  // Timers - REMOVED

  // Check Win Condition
  useEffect(() => {
    if (foundDifferences.length === MOCK_STAGE_DATA.differences.length) {
      setGameState('won');
      handleWin();
    }
  }, [foundDifferences]);

  const handleWin = async () => {
    // Stars are now fixed to 3 for clearing
    const stars = 3;
    const score = 1000; // Fixed score per stage clear

    await GameDataService.saveStageClear(seasonId, stageId, stars, score);

    Alert.alert('Stage Clear!', `별 ${stars}개를 획득했습니다!`, [
      { text: '다음 스테이지', onPress: () => navigation.goBack() }
    ]);
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

    let found = false;
    MOCK_STAGE_DATA.differences.forEach((diff) => {
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

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'} 뒤로</Text>
        </TouchableOpacity>
        {/* Timer Removed */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{foundDifferences.length} / {MOCK_STAGE_DATA.differences.length}</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameContent}>
        <View style={[styles.gameCard, { width: finalWidth, height: finalHeight * 2 + 2, backgroundColor: 'transparent' }]}>
          {/* Top Image */}
          <Pressable onPress={handleTouch} style={{ width: finalWidth, height: finalHeight }}>
            <Image source={MOCK_STAGE_DATA.imageSource1} style={styles.gameImage} resizeMode="contain" />

            {/* Markers */}
            {foundDifferences.map(id => {
              const diff = MOCK_STAGE_DATA.differences.find(d => d.id === id);
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
            <Image source={MOCK_STAGE_DATA.imageSource2} style={styles.gameImage} resizeMode="contain" />
            {foundDifferences.map(id => {
              const diff = MOCK_STAGE_DATA.differences.find(d => d.id === id);
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
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.footerText}>위 그림에서 틀린 부분을 찾아보세요!</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    // Height controlled dynamically
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // timerContainer: Removed
  // timerText: Removed
  scoreContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  scoreText: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 18,
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  gameCard: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  divider: {
    height: 4,
    width: '100%',
  },
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ef4444',
    backgroundColor: 'transparent',
  },
  footer: {
    alignItems: 'center',
    // Height controlled dynamically
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GameScreen;
