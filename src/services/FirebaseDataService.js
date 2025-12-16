import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import AuthService from './AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FirebaseDataService {
  constructor() {
    this.localKey = '@GameProgress';
    this.cachedSeasons = null;
    this.cachedStages = {};
  }

  // ========== 시즌 데이터 ==========
  async getAllSeasons() {
    if (this.cachedSeasons) return this.cachedSeasons;

    try {
      const seasonsRef = collection(db, 'seasons');
      const snapshot = await getDocs(query(seasonsRef, orderBy('id')));

      const seasons = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.cachedSeasons = seasons;
      return seasons;
    } catch (error) {
      console.error('Failed to load seasons:', error);
      return [];
    }
  }

  // ========== 스테이지 데이터 ==========
  async getStagesBySeasonId(seasonId) {
    if (this.cachedStages[seasonId]) {
      return this.cachedStages[seasonId];
    }

    try {
      const stagesRef = collection(db, 'stages');
      const q = query(
        stagesRef,
        where('seasonId', '==', seasonId),
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);

      const stages = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => a.stageNumber - b.stageNumber); // 클라이언트에서 정렬

      this.cachedStages[seasonId] = stages;
      return stages;
    } catch (error) {
      console.error('Failed to load stages:', error);
      return [];
    }
  }

  async getStageById(stageId) {
    try {
      const stageRef = doc(db, 'stages', stageId);
      const snapshot = await getDoc(stageRef);

      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (error) {
      console.error('Failed to load stage:', error);
      return null;
    }
  }

  // ========== 사용자 진행 상황 ==========
  async getUserProgress() {
    const userId = await AuthService.getUserId();
    if (!userId) {
      console.log('getUserProgress: No userId');
      return {};
    }

    try {
      const progressRef = collection(db, 'userProgress', userId, 'stages');
      const snapshot = await getDocs(progressRef);

      console.log('getUserProgress - 문서 개수:', snapshot.docs.length);

      const progress = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const seasonId = data.seasonId;
        const stageId = data.stageId;

        console.log('getUserProgress - 문서:', { docId: doc.id, seasonId, stageId, data });

        if (!progress[seasonId]) {
          progress[seasonId] = {};
        }
        progress[seasonId][stageId] = {
          cleared: data.cleared || false,
          stars: data.stars || 0,
          score: data.score || 0,
          unlocked: data.unlocked || false
        };
      });

      console.log('getUserProgress - 최종 progress:', progress);

      // AsyncStorage 백업 (오프라인 지원)
      await AsyncStorage.setItem(this.localKey, JSON.stringify(progress));

      return progress;
    } catch (error) {
      console.error('Failed to load user progress:', error);
      // 오프라인 시 로컬 데이터 사용
      const localData = await AsyncStorage.getItem(this.localKey);
      return localData ? JSON.parse(localData) : {};
    }
  }

  async saveStageClear(seasonId, stageId, stars, score) {
    const userId = await AuthService.getUserId();
    if (!userId) {
      console.log('saveStageClear: No userId');
      return;
    }

    try {
      const docId = `${seasonId}-${stageId}`;
      const progressRef = doc(db, 'userProgress', userId, 'stages', docId);

      const data = {
        seasonId,
        stageId,
        cleared: true,
        stars,
        score,
        unlocked: true,
        clearedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('saveStageClear - 저장 중:', { userId, docId, data });

      await setDoc(progressRef, data, { merge: true });

      console.log('saveStageClear - 저장 완료');

      // 다음 스테이지 자동 언록
      await this.unlockNextStage(seasonId, stageId);

      // 로컬 캐시 업데이트
      const progress = await this.getUserProgress();
      await AsyncStorage.setItem(this.localKey, JSON.stringify(progress));

      console.log('saveStageClear - 최종 progress:', progress);
    } catch (error) {
      console.error('Failed to save stage clear:', error);
    }
  }

  async unlockNextStage(seasonId, currentStageId) {
    const userId = await AuthService.getUserId();
    if (!userId) return;

    try {
      const stages = await this.getStagesBySeasonId(seasonId);
      const currentStage = stages.find(s => s.stageNumber === currentStageId);
      const nextStage = stages.find(s => s.stageNumber === currentStage.stageNumber + 1);

      if (nextStage) {
        const progressRef = doc(db, 'userProgress', userId, 'stages', `${seasonId}-${nextStage.stageNumber}`);
        await setDoc(progressRef, {
          seasonId,
          stageId: nextStage.stageNumber,
          unlocked: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Failed to unlock next stage:', error);
    }
  }

  async unlockStage(seasonId, stageId) {
    const userId = await AuthService.getUserId();
    if (!userId) return;

    try {
      const progressRef = doc(db, 'userProgress', userId, 'stages', `${seasonId}-${stageId}`);
      await setDoc(progressRef, {
        seasonId,
        stageId,
        unlocked: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Failed to unlock stage:', error);
    }
  }

  async initializeData() {
    // 스테이지 1 자동 언록
    await this.unlockStage(1, 1);
  }

  // ========== 진행률 계산 ==========
  async getSeasonProgress(seasonId) {
    const progress = await this.getUserProgress();
    return progress[seasonId] || {};
  }

  getSeasonProgressPercent(seasonProgress, totalStages) {
    const clearedCount = Object.values(seasonProgress).filter(s => s.cleared).length;
    return totalStages > 0 ? clearedCount / totalStages : 0;
  }

  getSeasonProgressText(seasonProgress, totalStages) {
    const clearedCount = Object.values(seasonProgress).filter(s => s.cleared).length;
    return `${clearedCount}/${totalStages}`;
  }

  // ========== 캐시 관리 ==========
  clearCache() {
    this.cachedSeasons = null;
    this.cachedStages = {};
  }
}

export default new FirebaseDataService();

// Named export for backward compatibility
export { FirebaseDataService as FirebaseDataServiceClass };
