import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SIZES.padding * 3) / 2;

// Mock Data
const STAGES = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Stage ${i + 1}`,
  locked: i > 2, // First 3 stages unlocked
  stars: i < 2 ? 3 : 0, // Mock stars for first 2
}));

const StageScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={item.locked}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={item.locked ? ['#A0aec0', '#718096'] : COLORS.gradients.primaryButton}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.id}</Text>
          {item.locked && <Text style={styles.icon}>🔒</Text>}
          {!item.locked && <Text style={styles.icon}>▶️</Text>}
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
        data={STAGES}
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
