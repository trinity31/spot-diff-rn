import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Alert, SafeAreaView, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { GameDataService } from '../services/GameDataService';

// Local Assets
const originalImage = require('../../assets/images/season1_stage1_orig.png');
const diffImage = require('../../assets/images/season1_stage1_diff.png');

// Mock Data for a stage
const MOCK_STAGE_DATA = {
  // Use require for local assets in React Native
  imageSource1: originalImage,
  imageSource2: diffImage,
  differences: [
    // Normalized coordinates (0.0 to 1.0)
    // Final Calibration by User (2025-12-13)
    { id: 1, x: 0.37, y: 0.17, radius: 0.09 },  // Star 
    { id: 2, x: 0.15, y: 0.50, radius: 0.09 },  // Stocking
    { id: 3, x: 0.28, y: 0.93, radius: 0.09 },  // Gift Box
  ],
  timeLimit: 60,
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
  const FINAL_IMAGE_SIZE = Math.min(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT);

  const [timeLeft, setTimeLeft] = useState(MOCK_STAGE_DATA.timeLimit);
  const [foundDifferences, setFoundDifferences] = useState([]);
  const [gameState, setGameState] = useState('playing');

  // Timers
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('lost');
          Alert.alert('Game Over', '시간이 초과되었습니다.', [
            { text: '다시 하기', onPress: resetGame },
            { text: '나가기', onPress: () => navigation.goBack() }
          ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check Win Condition
  useEffect(() => {
    if (foundDifferences.length === MOCK_STAGE_DATA.differences.length) {
      setGameState('won');
      handleWin();
    }
  }, [foundDifferences]);

  const handleWin = async () => {
    let stars = 1;
    if (timeLeft > 40) stars = 3;
    else if (timeLeft > 20) stars = 2;

    const score = stars * 1000 + timeLeft * 10;

    await GameDataService.saveStageClear(seasonId, stageId, stars, score);

    Alert.alert('Stage Clear!', `별 ${stars}개를 획득했습니다!`, [
      { text: '다음 스테이지', onPress: () => navigation.goBack() }
    ]);
  };

  const resetGame = () => {
    setTimeLeft(MOCK_STAGE_DATA.timeLimit);
    setFoundDifferences([]);
    setGameState('playing');
  };

  const handleTouch = (event) => {
    if (gameState !== 'playing') return;
    const { locationX, locationY } = event.nativeEvent;

    // Normalize touch to 0.0 - 1.0
    const xPct = locationX / FINAL_IMAGE_SIZE;
    const yPct = locationY / FINAL_IMAGE_SIZE;

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
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}초</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{foundDifferences.length} / {MOCK_STAGE_DATA.differences.length}</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameContent}>
        <View style={[styles.gameCard, { width: FINAL_IMAGE_SIZE, backgroundColor: 'transparent' }]}>
          {/* Top Image */}
          <Pressable onPress={handleTouch} style={{ width: FINAL_IMAGE_SIZE, height: FINAL_IMAGE_SIZE }}>
            <Image source={MOCK_STAGE_DATA.imageSource1} style={styles.gameImage} resizeMode="contain" />

            {/* Markers */}
            {/* Markers */}
            {foundDifferences.map(id => {
              const diff = MOCK_STAGE_DATA.differences.find(d => d.id === id);
              if (!diff) return null;

              // Calculate pixel position
              const left = diff.x * FINAL_IMAGE_SIZE;
              const top = diff.y * FINAL_IMAGE_SIZE;
              const size = diff.radius * FINAL_IMAGE_SIZE * 2;

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
          <Pressable onPress={handleTouch} style={{ width: FINAL_IMAGE_SIZE, height: FINAL_IMAGE_SIZE }}>
            <Image source={MOCK_STAGE_DATA.imageSource2} style={styles.gameImage} resizeMode="contain" />
            {foundDifferences.map(id => {
              const diff = MOCK_STAGE_DATA.differences.find(d => d.id === id);
              if (!diff) return null;

              const left = diff.x * FINAL_IMAGE_SIZE;
              const top = diff.y * FINAL_IMAGE_SIZE;
              const size = diff.radius * FINAL_IMAGE_SIZE * 2;

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
  timerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  timerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
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
