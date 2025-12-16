import { useHeaderHeight } from '@react-navigation/elements'; // Import hook
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../constants/theme';
import FirebaseDataService from '../services/FirebaseDataService';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SIZES.padding * 3) / 2;

const StageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const headerHeight = useHeaderHeight(); // Get header height
  const { seasonId, seasonTitle } = route.params;
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: seasonTitle || '스테이지 선택',
      headerTintColor: 'white',
      headerStyle: { backgroundColor: '#8b5cf6' }, // Match top of gradient or transparent
      headerTransparent: true, // Let gradient show through
      headerShadowVisible: false,
    });
  }, [navigation, seasonTitle]);

  useFocusEffect(
    useCallback(() => {
      loadStages();
    }, [seasonId])
  );

  const loadStages = async () => {
    try {
      setLoading(true);

      // Firebase에서 스테이지 목록과 진행 상황 가져오기
      const [firebaseStages, seasonProgress] = await Promise.all([
        FirebaseDataService.getStagesBySeasonId(seasonId),
        FirebaseDataService.getSeasonProgress(seasonId)
      ]);

      console.log('StageScreen - Firebase 스테이지:', firebaseStages);
      console.log('StageScreen - 진행 상황:', seasonProgress);

      const stageList = firebaseStages.map(stage => {
        const stageId = stage.stageNumber;
        const progress = seasonProgress[stageId];

        let unlocked = progress?.unlocked || false;
        // 첫 번째 스테이지는 항상 언락
        if (seasonId == 1 && stageId == 1) unlocked = true;

        return {
          id: stageId,
          title: stage.title,
          locked: !unlocked,
          cleared: progress?.cleared || false,
          imageUrl: stage.imageThumbnailUrl || stage.imageOriginalUrl // 썸네일 우선, 없으면 풀 사이즈
        };
      });

      console.log('StageScreen - 최종 스테이지 목록:', stageList);

      setStages(stageList);
    } catch (error) {
      console.error('Failed to load stages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStagePress = (stage) => {
    navigation.navigate('Game', {
      seasonId: seasonId,
      stageId: stage.id
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={item.locked}
      onPress={() => handleStagePress(item)}
      style={styles.cardContainer}
    >
      <View style={styles.cardShadow}>
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={[styles.cardImage, item.locked && styles.imageLocked]}
          imageStyle={{ borderRadius: 15 }}
          resizeMode="cover"
        >
          {/* Overlay Gradient/Darkness */}
          <View style={[
            styles.cardOverlay,
            item.locked ? styles.overlayLocked : styles.overlayUnlocked
          ]}>
            {/* Content */}
            <Text style={styles.stageNumber}>
              {item.id.toString().padStart(2, '0')}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.stageTitle} numberOfLines={1}>
              {item.locked ? '잠긴 여행지' : item.title}
            </Text>

            {/* Status Icons */}
            <View style={styles.statusIcons}>
              {item.locked && <Text style={styles.lockIcon}>🔒</Text>}
              {item.cleared && <Text style={styles.checkIcon}>✓</Text>}
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#8b5cf6', '#5b21b6']} style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>스테이지 로딩 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background updated to match app theme (SeasonScreen uses ['#667eea', '#764ba2']) */}
      {/* Using a lighter version or complementary gradient for Stage Selection */}
      <LinearGradient colors={['#8b5cf6', '#5b21b6']} style={StyleSheet.absoluteFill} />

      <FlatList
        data={stages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={1} // Single column for "Scenery" look
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: headerHeight + 20 } // Dynamic padding
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
  },
  listContent: {
    padding: 20,
    // paddingTop removed from here
  },
  cardContainer: {
    marginBottom: 20,
    height: 180, // Large scenery card
  },
  cardShadow: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, // increased shadow
    shadowOpacity: 0.3, // increased opacity
    shadowRadius: 24, // increased radius
    elevation: 8,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    // justifyContent: 'flex-end', // Removed to let overlay fill
  },
  imageLocked: {
    opacity: 0.5, // Dim the image itself
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayUnlocked: {
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker tint
  },
  overlayLocked: {
    backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay for locked
    justifyContent: 'center',
    alignItems: 'center',
  },

  stageNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  stageTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statusIcons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  lockIcon: {
    fontSize: 24,
  },
  checkIcon: {
    fontSize: 20,
    color: '#4ADE80',
    fontWeight: 'bold',
  },
});

export default StageScreen;
