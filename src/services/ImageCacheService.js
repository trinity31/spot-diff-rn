import * as FileSystem from 'expo-file-system';

class ImageCacheService {
  constructor() {
    this.cacheDir = `${FileSystem.cacheDirectory}game-images/`;
  }

  async ensureCacheDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
    }
  }

  async getCachedImage(url) {
    try {
      await this.ensureCacheDirExists();

      const filename = url.split('/').pop();
      const localUri = `${this.cacheDir}${filename}`;

      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (fileInfo.exists) {
        return localUri;
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
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (dirInfo.exists) {
        // 캐시 디렉토리의 모든 파일 크기 합계
        const files = await FileSystem.readDirectoryAsync(this.cacheDir);
        let totalSize = 0;

        for (const file of files) {
          const fileInfo = await FileSystem.getInfoAsync(`${this.cacheDir}${file}`);
          totalSize += fileInfo.size || 0;
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
