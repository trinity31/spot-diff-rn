import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { GameDataService } from '../services/GameDataService';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SIZES.padding * 3) / 2;

const StageScreen = () => {
  const route = useRoute();
  const { seasonId } = route.params; // Get passed season ID
  const [stages, setStages] = useState([]);

  // Mock total stages for now - in real app, might come from config or backend
  const TOTAL_STAGES = seasonId == 1 ? 30 : seasonId == 2 ? 35 : 40;

  useFocusEffect(
    useCallback(() => {
      loadStages();
    }, [seasonId])
  );

  const loadStages = async () => {
    // 1. Get user progress for this season
    const seasonProgress = await GameDataService.getSeasonProgress(seasonId);

    // 2. Build stage list combining config (1..N) and progress (unlocked/stars)
    const stageList = Array.from({ length: TOTAL_STAGES }, (_, i) => {
      const stageId = i + 1;
      const progress = seasonProgress[stageId];

      // Default: Locked unless found in progress and marked unlocked
      // Exception: Stage 1 of Season 1 is always unlocked (handled by GameDataService init, but safe fallback here)
      let unlocked = progress?.unlocked || false;
      if (seasonId == 1 && stageId == 1) unlocked = true;

      return {
        id: stageId,
        title: `Stage ${stageId}`,
        locked: !unlocked,
        stars: progress ? progress.stars : 0,
        cleared: progress ? progress.cleared : false
      };
    });

    setStages(stageList);
  };

  const handleStagePress = (stage) => {
    // TODO: Navigate to actual Game Screen
    // For now, let's simulate clearing it to test persistence
    simulateClearStage(stage.id);
  };

  const simulateClearStage = async (stageId) => {
    // Mock clearing with random stars (2 or 3)
    const stars = Math.floor(Math.random() * 2) + 2;
    const score = stars * 100;

    console.log(`Clearing Season ${seasonId} Stage ${stageId} with ${stars} stars`);
    await GameDataService.saveStageClear(seasonId, stageId, stars, score);

    // Refresh
    loadStages();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={item.locked}
      onPress={() => handleStagePress(item)}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={item.locked ? ['#A0aec0', '#718096'] : COLORS.gradients.primaryButton}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.id}</Text>
          {item.locked && <Text style={styles.icon}>🔒</Text>}
          {!item.locked && <Text style={styles.icon}>{item.cleared ? '✓' : '▶️'}</Text>}
        </View>
        <Text style={styles.stageLabel}>Stage</Text>

        {!item.locked && (
          <View style={styles.starsContainer}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Text key={i} style={styles.star}>
                {i < item.stars ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={COLORS.gradients.background}
      style={styles.container}
    >
      <FlatList
        data={stages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding + 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  cardContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  card: {
    flex: 1,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  stageLabel: {
    fontSize: SIZES.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 14,
    color: '#FFD700',
  },
});

export default StageScreen;
