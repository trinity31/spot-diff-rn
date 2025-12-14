import { useHeaderHeight } from '@react-navigation/elements'; // Import hook
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SIZES } from '../constants/theme';
import { GameDataService } from '../services/GameDataService';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - SIZES.padding * 3) / 2;

import { SEASON1_STAGES } from '../constants/StageData';

const StageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const headerHeight = useHeaderHeight(); // Get header height
  const { seasonId, seasonTitle } = route.params;
  const [stages, setStages] = useState([]);

  const TOTAL_STAGES = 30; // Fixed to 30 for all seasons for now

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
    const seasonProgress = await GameDataService.getSeasonProgress(seasonId);

    const stageList = Array.from({ length: TOTAL_STAGES }, (_, i) => {
      const stageId = i + 1;
      const progress = seasonProgress[stageId];
      let unlocked = progress?.unlocked || false;
      if (seasonId == 1 && stageId == 1) unlocked = true;

      // Get Data from Shared Constant
      const data = SEASON1_STAGES[stageId];
      const title = data ? data.title : `여행지 ${stageId}`;
      // Use specific image if available, else fallback to stage 1 if exists, else null
      const image = data ? data.imageOrig : (SEASON1_STAGES[1] ? SEASON1_STAGES[1].imageOrig : null);

      return {
        id: stageId,
        title: title,
        locked: !unlocked,
        cleared: progress ? progress.cleared : false,
        image: image
      };
    });

    setStages(stageList);
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
          source={item.image}
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
