import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = 'game_data_';
const USER_PROGRESS_KEY = 'user_progress';

export const GameDataService = {
  /**
   * Get all progress data for the user.
   * Structure:
   * {
   *   [seasonId]: {
   *     [stageId]: {
   *       cleared: boolean,
   *       stars: number (0-3),
   *       score: number,
   *       unlocked: boolean
   *     }
   *   }
   * }
   */
  async getAllProgress() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + USER_PROGRESS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      console.error('Failed to load progress', e);
      return {};
    }
  },

  /**
   * Get progress for a specific season.
   */
  async getSeasonProgress(seasonId) {
    const allProgress = await this.getAllProgress();
    return allProgress[seasonId] || {};
  },

  /**
   * Save progress for a specific stage.
   * Call this when a stage is cleared.
   */
  async saveStageClear(seasonId, stageId, stars, score) {
    try {
      const allProgress = await this.getAllProgress();

      if (!allProgress[seasonId]) {
        allProgress[seasonId] = {};
      }

      // Update current stage
      allProgress[seasonId][stageId] = {
        cleared: true,
        stars: Math.max(stars, allProgress[seasonId][stageId]?.stars || 0), // Keep max stars
        score: Math.max(score, allProgress[seasonId][stageId]?.score || 0), // Keep max score
        unlocked: true,
      };

      // Unlock next stage logic (simple +1 assumption for now)
      const nextStageId = stageId + 1;
      if (!allProgress[seasonId][nextStageId]) {
        allProgress[seasonId][nextStageId] = {
          cleared: false,
          stars: 0,
          score: 0,
          unlocked: true, // Unlock the next one
        };
      } else {
        allProgress[seasonId][nextStageId].unlocked = true;
      }

      await AsyncStorage.setItem(STORAGE_KEY_PREFIX + USER_PROGRESS_KEY, JSON.stringify(allProgress));
      return true;
    } catch (e) {
      console.error('Failed to save progress', e);
      return false;
    }
  },

  /**
   * Initialize default data for a new user (or reset).
   * Ensures Season 1 Stage 1 is unlocked.
   */
  async initializeData() {
    const allProgress = await this.getAllProgress();
    // Check if empty or Season 1 Stage 1 missing
    if (!allProgress['1'] || !allProgress['1']['1']) {
      await this.unlockStage(1, 1);
    }
  },

  /**
   * Force unlock a specific stage (debug or init use).
   */
  async unlockStage(seasonId, stageId) {
    try {
      const allProgress = await this.getAllProgress();
      if (!allProgress[seasonId]) {
        allProgress[seasonId] = {};
      }

      if (!allProgress[seasonId][stageId]) {
        allProgress[seasonId][stageId] = {
          cleared: false,
          stars: 0,
          score: 0,
          unlocked: true
        };
      } else {
        allProgress[seasonId][stageId].unlocked = true;
      }

      await AsyncStorage.setItem(STORAGE_KEY_PREFIX + USER_PROGRESS_KEY, JSON.stringify(allProgress));
    } catch (e) {
      console.error('Failed to unlock stage', e);
    }
  },

  /**
   * Calculate total progress percentage for a season
   * Returns a value between 0 and 1.
   */
  async getSeasonProgressPercent(seasonId, totalStages) {
    const seasonData = await this.getSeasonProgress(seasonId);
    const clearedCount = Object.values(seasonData).filter(s => s.cleared).length;
    return totalStages > 0 ? (clearedCount / totalStages) : 0;
  },

  /**
   * Get cleared count string e.g., "5/20"
   */
  async getSeasonProgressText(seasonId, totalStages) {
    const seasonData = await this.getSeasonProgress(seasonId);
    const clearedCount = Object.values(seasonData).filter(s => s.cleared).length;
    return `${clearedCount}/${totalStages}`;
  }
};
