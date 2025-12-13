import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { GameDataService } from '../services/GameDataService';

const { width } = Dimensions.get('window');

// Mock Data for Seasons matching the design
// const SEASONS = [
//   {
//     id: 1,
//     seasonNumber: 'SEASON 1',
//     title: '발견의 시작',
//     description: '탐험가의 첫 걸음을 내딛어보세요.',
//     active: true,
//     status: 'complete', // 'complete', 'progress', 'locked'
//     statusText: '완료',
//     progress: 1, // 100%
//     progressText: '30/30',
//     totalStages: 30,
//     difficulty: 3,
//     illustrationColors: ['#fbbf24', '#f59e0b'],
//     illustrationIcon: '☀️',
//     buttonText: '다시 플레이'
//   },
//   {
//     id: 2,
//     seasonNumber: 'SEASON 2',
//     title: '도시의 미스터리',
//     description: '밤의 도시에 숨겨진 비밀을 찾아내세요.',
//     active: true,
//     status: 'progress',
//     statusText: '진행중',
//     progress: 0.51,
//     progressText: '18/35',
//     totalStages: 35,
//     difficulty: 4,
//     illustrationColors: ['#3b82f6', '#1d4ed8'],
//     illustrationIcon: '🌙',
//     buttonText: '계속하기'
//   },
//   {
//     id: 3,
//     seasonNumber: 'SEASON 3',
//     title: '숲 속의 탐험',
//     description: '신비로운 숲을 탐험하며 자연 속 숨겨진 디테일을 발견하세요.',
//     active: false,
//     status: 'locked',
//     statusText: '잠김',
//     progress: 0.07,
//     progressText: '3/40',
//     totalStages: 40,
//     difficulty: 5,
//     illustrationColors: ['#10b981', '#059669'],
//     illustrationIcon: '🌲',
//     buttonText: '시작하기'
//   },
//   {
//     id: 4,
//     seasonNumber: 'SEASON 4',
//     title: '우주의 비밀',
//     description: '무한한 우주 공간의 숨겨진 차이를 찾아내세요.',
//     active: false,
//     status: 'locked',
//     statusText: '잠김',
//     progress: 0,
//     progressText: '0/50',
//     totalStages: 50,
//     difficulty: 5,
//     illustrationColors: ['#6366f1', '#4f46e5'],
//     illustrationIcon: '🚀',
//     buttonText: '시즌 3 완료 필요'
//   },
// ];

const SeasonScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [seasons, setSeasons] = useState([
    {
      id: 1,
      seasonNumber: 'SEASON 1',
      title: '발견의 시작',
      description: '탐험가의 첫 걸음을 내딛어보세요.',
      active: true,
      status: 'locked', // Default locked until loaded
      statusText: '잠김',
      progress: 0,
      progressText: '0/30',
      totalStages: 30,
      difficulty: 3,
      illustrationColors: ['#fbbf24', '#f59e0b'],
      illustrationIcon: '☀️',
      buttonText: '시작하기'
    },
    {
      id: 2,
      seasonNumber: 'SEASON 2',
      title: '도시의 미스터리',
      description: '밤의 도시에 숨겨진 비밀을 찾아내세요.',
      active: true, // App logic wise active, but status depends on completion of prev season
      status: 'locked',
      statusText: '잠김',
      progress: 0,
      progressText: '0/35',
      totalStages: 35,
      difficulty: 4,
      illustrationColors: ['#3b82f6', '#1d4ed8'],
      illustrationIcon: '🌙',
      buttonText: '시즌 1 완료 필요'
    },
    {
      id: 3,
      seasonNumber: 'SEASON 3',
      title: '숲 속의 탐험',
      description: '신비로운 숲을 탐험하며 자연 속 숨겨진 디테일을 발견하세요.',
      active: false,
      status: 'locked',
      statusText: '잠김',
      progress: 0,
      progressText: '0/40',
      totalStages: 40,
      difficulty: 5,
      illustrationColors: ['#10b981', '#059669'],
      illustrationIcon: '🌲',
      buttonText: '시즌 2 완료 필요'
    },
    {
      id: 4,
      seasonNumber: 'SEASON 4',
      title: '우주의 비밀',
      description: '무한한 우주 공간의 숨겨진 차이를 찾아내세요.',
      active: false,
      status: 'locked',
      statusText: '잠김',
      progress: 0,
      progressText: '0/50',
      totalStages: 50,
      difficulty: 5,
      illustrationColors: ['#6366f1', '#4f46e5'],
      illustrationIcon: '🚀',
      buttonText: '시즌 3 완료 필요'
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    // Ensure basic data exists
    await GameDataService.initializeData();

    // Load progress map
    const allProgress = await GameDataService.getAllProgress();

    const updatedSeasons = await Promise.all(seasons.map(async (season) => {
      // Calculate progress for this season
      const seasonId = season.id.toString();
      const seasonData = allProgress[seasonId] || {};

      const totalStages = season.totalStages;
      const clearedCount = Object.values(seasonData).filter(s => s.cleared).length;
      const progressPercent = totalStages > 0 ? clearedCount / totalStages : 0;

      // Determine status
      // Logic: Season 1 is always unlocked (or if initData called).
      // Season N is unlocked if Season N-1 is complete? 
      // For now, let's keep it simple: Season 1 unlocked always. Others Locked.
      // Or check if ANY stage in this season is unlocked?
      // Let's use: if seasonData has any unlocked stage, it is 'progress' or 'complete'
      // If clearedCount == totalStages -> complete.

      const hasUnlockedStage = Object.values(seasonData).some(s => s.unlocked);
      let status = 'locked';
      let statusText = '잠김';
      let buttonText = season.buttonText; // Default text

      // Override for Season 1 to be always at least 'progress' (active)
      if (season.id === 1) {
        status = 'progress';
      }

      if (clearedCount === totalStages && totalStages > 0) {
        status = 'complete';
        statusText = '완료';
        buttonText = '다시 플레이';
      } else if (hasUnlockedStage || season.id === 1) {
        status = 'progress';
        statusText = '진행중';
        buttonText = '계속하기';
      }

      // Force locked for future seasons mock
      if (season.id > 2) {
        status = 'locked';
        buttonText = '준비중';
      }

      return {
        ...season,
        progress: progressPercent,
        progressText: `${clearedCount}/${totalStages}`,
        status,
        statusText,
        buttonText
      };
    }));

    setSeasons(updatedSeasons);
  };

  const handleSeasonPress = (season) => {
    if (season.status !== 'locked') {
      navigation.navigate('Stage', {
        seasonId: season.id,
        seasonTitle: season.title // Just the title, e.g. "발견의 시작"
      });
    }
  };

  const renderItem = ({ item }) => {
    const isLocked = item.status === 'locked';

    // Status Badge Styles
    let statusBg, statusColor, statusIcon;
    switch (item.status) {
      case 'complete':
        statusBg = '#10b981'; statusColor = 'white'; statusIcon = '✓';
        break;
      case 'progress':
        statusBg = '#f59e0b'; statusColor = 'white'; statusIcon = '►';
        break;
      default:
        statusBg = '#6b7280'; statusColor = 'white'; statusIcon = '🔒';
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={isLocked}
        onPress={() => handleSeasonPress(item)}
        style={[styles.cardContainer, isLocked && styles.cardLocked]}
      >
        <View style={styles.card}>
          {/* Illustration Section */}
          <LinearGradient
            colors={item.illustrationColors}
            style={styles.illustration}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.illustrationIcon}>{item.illustrationIcon}</Text>
          </LinearGradient>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.seasonHeader}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.seasonBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.seasonBadgeText}>{item.seasonNumber}</Text>
              </LinearGradient>

              <View style={styles.statusContainer}>
                <View style={[styles.statusIcon, { backgroundColor: statusBg }]}>
                  <Text style={styles.statusIconText}>{statusIcon}</Text>
                </View>
                <Text style={[styles.statusText, { color: statusBg }]}>{item.statusText}</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
              {item.description}
            </Text>

            {/* Progress Section */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabel}>
                <Text style={styles.progressLabelText}>진행률</Text>
                <Text style={styles.progressLabelText}>{item.progressText}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={[styles.progressBarFill, { width: `${item.progress * 100}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{item.totalStages}</Text>
                <Text style={styles.statLabel}>스테이지</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {Array(item.difficulty).fill('⭐').join('')}
                </Text>
                <Text style={styles.statLabel}>난이도</Text>
              </View>
            </View>

            {/* Button */}
            {isLocked ? (
              <View style={[styles.actionButton, styles.actionButtonLocked]}>
                <Text style={[styles.actionButtonText, styles.actionButtonTextLocked]}>
                  {`🔒 ${item.buttonText}`}
                </Text>
              </View>
            ) : (
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.actionButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionButtonText}>{item.buttonText}</Text>
              </LinearGradient>
            )}

          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']} // Matches design background
      style={styles.container}
    >
      <FlatList
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 20, paddingBottom: 40 }]}>
            <Text style={styles.screenTitle}>🔍 틀린그림찾기</Text>
            <Text style={styles.screenSubtitle}>숨겨진 차이를 찾아 모험을 떠나보세요!</Text>
          </View>
        }
        data={seasons}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10, // Reduced from 60 to 10 - adjusted because SafeAreaView handles some top padding usually, or just visually reducing it
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 28, // Slightly reduced
    fontWeight: '800', // ExtraBold
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  screenSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  cardContainer: {
    marginBottom: 30,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardLocked: {
    opacity: 0.7,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
  },
  illustration: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationIcon: {
    fontSize: 80,
  },
  infoSection: {
    padding: 24,
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seasonBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  seasonBadgeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  actionButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#667eea',
    // Since we need gradient for active button, better to wrap Text in LinearGradient or View.
    // Let's use a solid color here or refactor to use LinearGradient for button
  },
  actionButtonLocked: {
    backgroundColor: '#e5e7eb',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  actionButtonTextLocked: {
    color: '#9ca3af',
  },
});

export default SeasonScreen;
