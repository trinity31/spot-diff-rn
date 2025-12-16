import * as FileSystem from 'expo-file-system';

class ImageCacheService {
  constructor() {
    this.cacheDir = `${FileSystem.cacheDirectory}game-images/`;
  }

  async ensureCacheDirExists() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir, { size: false });
      if (!dirInfo.exists) {
        await FileSystem.StorageAccessFramework.makeDirectoryAsync(this.cacheDir);
      }
    } catch (error) {
      // 디렉토리가 없으면 생성 시도
      try {
        await FileSystem.StorageAccessFramework.makeDirectoryAsync(this.cacheDir);
      } catch (mkdirError) {
        console.error('Failed to create cache directory:', mkdirError);
      }
    }
  }

  async getCachedImage(url) {
    try {
      await this.ensureCacheDirExists();

      const filename = url.split('/').pop().split('?')[0]; // 쿼리 파라미터 제거
      const localUri = `${this.cacheDir}${filename}`;

      try {
        const fileInfo = await FileSystem.getInfoAsync(localUri, { size: false });
        if (fileInfo.exists) {
          console.log(`Using cached image: ${filename}`);
          return localUri;
        }
      } catch (error) {
        // 파일이 없으면 다운로드
      }

      // 다운로드
      console.log(`Downloading image: ${url}`);
      const downloadResult = await FileSystem.downloadAsync(url, localUri);
      return downloadResult.uri;
    } catch (error) {
      console.error('Failed to cache image:', error);
      // 캐싱 실패 시 원본 URL 반환
      return url;
    }
  }

  async clearCache() {
    try {
      await FileSystem.deleteAsync(this.cacheDir, { idempotent: true });
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async getCacheSize() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir, { size: true });
      if (dirInfo.exists) {
        // 캐시 디렉토리의 모든 파일 크기 합계
        const files = await FileSystem.readDirectoryAsync(this.cacheDir);
        let totalSize = 0;

        for (const file of files) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(`${this.cacheDir}${file}`, { size: true });
            totalSize += fileInfo.size || 0;
          } catch (error) {
            // 파일 정보를 가져올 수 없으면 스킵
          }
        }

        return totalSize;
      }
      return 0;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }
}

export default new ImageCacheService();
